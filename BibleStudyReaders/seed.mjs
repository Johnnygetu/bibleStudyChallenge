import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://kjwyabpruzdzmihbebmj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqd3lhYnBydXpkem1paGJlYm1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2OTc1MjksImV4cCI6MjEwNTI3MzUyOX0.wWejeCI26e2XP6wSW-PqoDS--coFI08D4l1Qu0-LEiQ');
async function seed() {
  const dummyQuestions = [
    {
      chapter_label: 'Revelation 16',
      question_text: 'What was poured out in Revelation 16?',
      option_a: 'Seven bowls of wrath',
      option_b: 'Seven trumpets',
      option_c: 'Seven seals',
      option_d: 'Seven thunders',
      correct_option: 'a'
    },
    {
      chapter_label: 'Revelation 16',
      question_text: 'Where did the first angel pour his bowl?',
      option_a: 'On the sea',
      option_b: 'On the sun',
      option_c: 'On the earth',
      option_d: 'On the rivers',
      correct_option: 'c'
    },
    {
      chapter_label: 'Revelation 17',
      question_text: 'What was the woman in Revelation 17 sitting on?',
      option_a: 'A white horse',
      option_b: 'A scarlet beast',
      option_c: 'A golden throne',
      option_d: 'A cloud',
      correct_option: 'b'
    }
  ];

  const dummyProfiles = [
    {
      id: 'd0000000-0000-0000-0000-000000000001',
      telegram_id: 111111,
      first_name: 'John',
      last_name: 'Doe',
      current_streak: 15,
      longest_streak: 20,
      total_quiz_correct: 45,
      total_quiz_answered: 50,
      points: 1500
    },
    {
      id: 'd0000000-0000-0000-0000-000000000002',
      telegram_id: 222222,
      first_name: 'Sarah',
      last_name: 'Smith',
      current_streak: 30,
      longest_streak: 45,
      total_quiz_correct: 120,
      total_quiz_answered: 130,
      points: 4200
    },
    {
      id: 'd0000000-0000-0000-0000-000000000003',
      telegram_id: 333333,
      first_name: 'David',
      last_name: 'Johnson',
      current_streak: 5,
      longest_streak: 12,
      total_quiz_correct: 20,
      total_quiz_answered: 25,
      points: 600
    },
    {
      id: 'd0000000-0000-0000-0000-000000000004',
      telegram_id: 444444,
      first_name: 'Emily',
      last_name: 'Davis',
      current_streak: 42,
      longest_streak: 42,
      total_quiz_correct: 150,
      total_quiz_answered: 160,
      points: 5100
    }
  ];

  const { error: err1 } = await supabase.from('quiz_questions').insert(dummyQuestions);
  if (err1) console.error("Error inserting questions:", err1);
  else console.log("Questions inserted.");

  const { error: err2 } = await supabase.from('profiles').upsert(dummyProfiles);
  if (err2) console.error("Error inserting profiles:", err2);
  else console.log("Profiles inserted.");
}
seed();
