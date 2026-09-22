import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://kjwyabpruzdzmihbebmj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqd3lhYnBydXpkem1paGJlYm1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2OTc1MjksImV4cCI6MjEwNTI3MzUyOX0.wWejeCI26e2XP6wSW-PqoDS--coFI08D4l1Qu0-LEiQ');
async function test() {
  const { error } = await supabase.from('reading_progress').insert({
    profile_id: '00000000-0000-0000-0000-000000000000',
    plan_day_id: 'b318ef06-c1e1-4dd3-bbd6-0789ad95126a',
    chapter_label: 'Genesis 1'
  });
  console.log('Error:', error);
}
test();
