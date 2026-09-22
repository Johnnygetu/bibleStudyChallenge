export type ReaderStatus = 'active' | 'paused' | 'dropped';

export interface Reader {
  id: string;
  name: string;
  phone: string | null;
  telegram_id: string | null;
  status: ReaderStatus;
  current_streak: number;
  longest_streak: number;
  last_read_date: string | null;
  created_at: string;
}

export interface ReadingSchedule {
  id: string;
  day_number: number;
  week_number: number;
  reading_from: string;
  reading_to: string;
  section: string | null;
  release_date: string;
}

export interface ReadingProgress {
  id: string;
  reader_id: string;
  schedule_id: string;
  completed: boolean;
  completed_at: string;
}

export interface QuizQuestion {
  id: string;
  week_number: number;
  book?: string;
  chapter?: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'a' | 'b' | 'c' | 'd';
  bible_reference: string | null;
  created_at: string;
}

export interface QuizResponse {
  id: string;
  reader_id: string;
  question_id: string;
  selected_option: 'a' | 'b' | 'c' | 'd';
  is_correct: boolean;
  answered_at: string;
}

export interface LeaderboardEntry {
  reader_id: string;
  reader_name: string;
  total_correct: number;
  total_answered: number;
  current_streak: number;
  longest_streak: number;
  days_completed: number;
}
