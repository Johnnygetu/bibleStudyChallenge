-- Supabase Migration: Week-based to Chapter-based quizzes

-- 1. Modify the `quiz_questions` table to replace `week_number` with `chapter_label`
ALTER TABLE public.quiz_questions 
  DROP COLUMN IF EXISTS week_number,
  ADD COLUMN IF NOT EXISTS chapter_label text NOT NULL DEFAULT '';

-- 2. Create an index on `chapter_label` to optimize queries when checking for quizzes
CREATE INDEX IF NOT EXISTS idx_quiz_questions_chapter_label 
  ON public.quiz_questions(chapter_label);

-- Note: Depending on your exact schema, you may need to update RLS policies if they relied on week_number.
