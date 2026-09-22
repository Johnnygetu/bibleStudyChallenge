import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://kjwyabpruzdzmihbebmj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqd3lhYnBydXpkem1paGJlYm1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2OTc1MjksImV4cCI6MjEwNTI3MzUyOX0.wWejeCI26e2XP6wSW-PqoDS--coFI08D4l1Qu0-LEiQ');
async function run() {
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
    }
  ];

  const { error: err2 } = await supabase.from('profiles').upsert(dummyProfiles);
  if (err2) console.error("Error inserting profiles:", err2);
  else console.log("Profiles inserted.");
}
run();
