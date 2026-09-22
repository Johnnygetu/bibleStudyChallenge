import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://kjwyabpruzdzmihbebmj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqd3lhYnBydXpkem1paGJlYm1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2OTc1MjksImV4cCI6MjEwNTI3MzUyOX0.wWejeCI26e2XP6wSW-PqoDS--coFI08D4l1Qu0-LEiQ');
async function test() {
  const { error } = await supabase.from('profiles').insert({
    id: '00000000-0000-0000-0000-000000000000',
    telegram_id: 12345,
    username: "devmode",
    first_name: "Developer",
    last_name: "Mode",
    current_streak: 12,
    longest_streak: 15,
    total_quiz_correct: 42,
    total_quiz_answered: 50
  });
  console.log('Error:', error);
}
test();
