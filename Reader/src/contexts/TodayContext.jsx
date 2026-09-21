import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getDummyQuestions, dummyProgress, getDummyQuestionForDay } from '../lib/dummy';

const TodayContext = createContext();

export function TodayProvider({ children }) {
  const [question, setQuestion] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [readerProfile, setReaderProfile] = useState(null);
  
  const [todayDate, setTodayDate] = useState(new Date());

  const load = useCallback(async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    // Get phone from local storage
    const storedPhone = localStorage.getItem('reader_phone');
    if (storedPhone) {
      setReaderProfile({ phone: storedPhone, current_streak: 5 });
    }

    const today = todayDate;
    const startDate = new Date('2026-09-21');
    const daysDiff = Math.max(1, Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    const q = getDummyQuestionForDay(daysDiff);
    if (!q) {
      setQuestion(null);
      setLoading(false);
      return;
    }

    setQuestion(q);
    
    // Check if already completed today
    const myProgress = dummyProgress.find(p => p.reader_id === 'r1' && p.schedule_id === `s${daysDiff}`);
    if (myProgress && myProgress.completed) {
      setCompleted(true);
      setSubmitted(true);
      setSelected(q.correct_option);
      setIsCorrect(true);
    }
    
    setLoading(false);
  }, [todayDate]);

  useEffect(() => {
    load();
  }, [load]);

  async function submitAnswer() {
    if (!selected || submitted) return;
    
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 400));
    
    setSubmitted(true);
    if (selected === question.correct_option) {
      setIsCorrect(true);
      setCompleted(true);
      if (readerProfile) {
         setReaderProfile({...readerProfile, current_streak: (readerProfile.current_streak || 0) + 1});
      }
    }
  }

  return (
    <TodayContext.Provider value={{ 
      question, completed, loading, selected, setSelected, 
      submitted, isCorrect, showExplanation, setShowExplanation, 
      readerProfile, submitAnswer, todayDate 
    }}>
      {children}
    </TodayContext.Provider>
  );
}

export function useToday() {
  return useContext(TodayContext);
}
