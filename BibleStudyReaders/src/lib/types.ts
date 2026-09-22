// Type definitions for BibleStudyReaders

export interface Profile {
  id: string;
  telegram_id: number;
  username: string | null;
  first_name: string;
  last_name: string | null;
  photo_url: string | null;
  current_streak: number;
  longest_streak: number;
  last_read_date: string | null;
  total_quiz_correct: number;
  total_quiz_answered: number;
  created_at: string;
  updated_at: string;
}

export interface ReadingPlanDay {
  id: string;
  day_number: number;
  week_number: number;
  book: string;
  chapters: string;
  chapters_total: number;
}

export interface ReadingProgressEntry {
  id: string;
  profile_id: string;
  plan_day_id: string;
  chapter_label: string;
  completed_at: string;
}

export interface QuizQuestion {
  id: string;
  chapter_label: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: "a" | "b" | "c" | "d";
}

export interface QuizAnswer {
  id: string;
  profile_id: string;
  question_id: string;
  selected_option: "a" | "b" | "c" | "d";
  is_correct: boolean;
  answered_at: string;
}

export interface LeaderboardEntry {
  id: string;
  telegram_id: number;
  username: string | null;
  first_name: string;
  last_name: string | null;
  photo_url: string | null;
  current_streak: number;
  longest_streak: number;
  total_quiz_correct: number;
  total_quiz_answered: number;
  score: number;
}
