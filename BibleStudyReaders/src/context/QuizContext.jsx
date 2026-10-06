import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useGeneralContext } from "@/context/GeneralContext";
import { useUserContext } from "@/context/UserContext";
import { useDateOverride } from "@/context/DateOverrideContext";
import { useReadingContext } from "@/context/ReadingContext";
import { useLeaderboardContext } from "@/context/LeaderboardContext";
import { getApiErrorMessage, readJsonResponse } from "@/lib/api";
import { hapticImpact, hapticNotification } from "@/lib/telegram";

// Owns the day's quiz: the questions fetch, the answers picked, and the score
// submission. The chapter ids and the "reading finished" flag come from the
// reading context, since the quiz can't exist without today's chapters.
export const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const { apiUrl } = useGeneralContext();
  const { user } = useUserContext();
  const { buildUrl } = useDateOverride();
  const { chapterKey, allDone, quizDoneToday, reloadToken } = useReadingContext();
  const { reload: reloadLeaderboard } = useLeaderboardContext();

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizLoading, setQuizLoading] = useState(false);
  const [hasQuestions, setHasQuestions] = useState(true);
  const [questionError, setQuestionError] = useState(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [quizSubmitError, setQuizSubmitError] = useState(null);
  const [questionsToken, setQuestionsToken] = useState(0);

  // Today's quiz is over once the whole quiz has been handed in — in this
  // session or on an earlier visit. There is nothing left to answer, so the
  // screen shows the score in place of the questions. An early submission, made
  // before today's reading was finished, does not end it: finishing the reading
  // unlocks the rest of the questions and the reader carries on.
  const quizComplete = !!quizResult?.complete;
  const quizOver = quizDoneToday || quizComplete;

  useEffect(() => {
    if (!chapterKey || quizOver) {
      setQuizQuestions([]);
      setHasQuestions(false);
      setQuestionError(null);
      setQuizLoading(false);
      return;
    }

    let cancelled = false;
    setQuestionError(null);
    setQuizLoading(true);

    async function fetchQuestions() {
      try {
        const res = await fetch(buildUrl(`${apiUrl}/questions/by-chapters?chapter_ids=${chapterKey}`), {
          headers: { Accept: "application/json" },
        });
        const payload = await readJsonResponse(res, "Today's quiz");
        if (!cancelled) {
          const questions = Array.isArray(payload?.questions) ? payload.questions : [];
          setQuizQuestions(questions);
          setHasQuestions(payload?.has_questions ?? questions.length > 0);
        }
      } catch (err) {
        if (!cancelled) {
          setHasQuestions(false);
          setQuestionError(getApiErrorMessage(err, apiUrl));
        }
      } finally {
        if (!cancelled) setQuizLoading(false);
      }
    }

    fetchQuestions();
    return () => {
      cancelled = true;
    };
  }, [apiUrl, buildUrl, chapterKey, questionsToken, quizOver, reloadToken]);

  const reloadQuestions = useCallback(() => setQuestionsToken((token) => token + 1), []);

  // Only the unlocked questions can be answered and submitted; finishing the
  // reading unlocks the rest, which makes the button available once more.
  const visibleQuizQuestions = useMemo(() => {
    const visible = allDone ? quizQuestions : quizQuestions.slice(0, 1);
    return visible.map((question) => {
      const selectedAnswerId = quizAnswers[question.id];
      return {
        ...question,
        answers: (question.answers || []).map((answer) => ({
          id: answer.id,
          answer_text: answer.answer_text,
          isSelected: selectedAnswerId === answer.id,
          // Only ever true for the questions still on screen, which is never a
          // handed-in quiz — the mark stays off so a pick can't give itself away
          // before the reader has decided to submit.
          showCorrect: quizComplete && !!answer.correct_answer,
          showWrong: quizComplete && selectedAnswerId === answer.id && !answer.correct_answer,
        })),
      };
    });
  }, [allDone, quizAnswers, quizQuestions, quizComplete]);

  const allQuizAnswered =
    visibleQuizQuestions.length > 0 && visibleQuizQuestions.every((q) => quizAnswers[q.id]);
  const canSubmitQuiz =
    allQuizAnswered && (!quizResult || quizResult.answered < visibleQuizQuestions.length);

  const submitLabel = isSubmittingQuiz
    ? "Submitting..."
    : quizResult && !canSubmitQuiz
      ? "Submitted"
      : "Submit quiz";

  // Choosing an answer only records it. No verdict comes back — from the screen
  // or from the phone — until the quiz is handed in, and until then the reader
  // is free to change their mind.
  const answerQuestion = useCallback(
    (questionId, answerId) => {
      if (quizComplete || isSubmittingQuiz) return;
      hapticImpact("medium");
      setQuizAnswers((prev) => ({ ...prev, [questionId]: answerId }));
    },
    [isSubmittingQuiz, quizComplete]
  );

  // Post today's answers; the server computes the score and stores one row per
  // reading day, then the leaderboard refreshes with the new total.
  const submitQuiz = useCallback(async () => {
    if (!user?.id || isSubmittingQuiz || !canSubmitQuiz) return;

    const payload = visibleQuizQuestions.map((question) => ({
      question_id: question.id,
      answer_id: quizAnswers[question.id],
    }));

    setIsSubmittingQuiz(true);
    setQuizSubmitError(null);
    try {
      hapticImpact("medium");
      // buildUrl matters here: under a processing-date override the score has
      // to land on the same simulated day the reading pages are asking about,
      // or `has_submitted_quiz_today` never sees it and the quiz comes back.
      const res = await fetch(buildUrl(`${apiUrl}/readers/${user.id}/scores`), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ answers: payload }),
      });
      if (!res.ok) throw new Error(`The server responded with ${res.status}.`);

      const data = await res.json();
      hapticNotification("success");
      // `complete` records whether the whole quiz was open when it went in, and
      // is what decides if the answers may be shown back.
      setQuizResult({ score: data.score, answered: data.answered, complete: allDone });
      reloadLeaderboard();
    } catch (err) {
      console.error("Failed to submit quiz", err);
      hapticNotification("error");
      setQuizSubmitError("Could not submit your quiz. Check your connection and try again.");
    } finally {
      setIsSubmittingQuiz(false);
    }
  }, [allDone, apiUrl, buildUrl, canSubmitQuiz, isSubmittingQuiz, quizAnswers, reloadLeaderboard, user, visibleQuizQuestions]);

  const value = {
    quizLoading,
    hasQuestions,
    questionError,
    questions: visibleQuizQuestions,
    isSubmittingQuiz,
    quizResult,
    quizSubmitError,
    quizOver,
    allQuizAnswered,
    canSubmitQuiz,
    submitLabel,
    answerQuestion,
    submitQuiz,
    reloadQuestions,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuizContext() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuizContext must be used within QuizProvider");
  return ctx;
}
