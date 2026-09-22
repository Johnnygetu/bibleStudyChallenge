import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://kjwyabpruzdzmihbebmj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqd3lhYnBydXpkem1paGJlYm1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2OTc1MjksImV4cCI6MjEwNTI3MzUyOX0.wWejeCI26e2XP6wSW-PqoDS--coFI08D4l1Qu0-LEiQ');
async function test() {
  const { data, error } = await supabase.from('profiles').select('*');
  console.log('Profiles:', data);
}
test();
