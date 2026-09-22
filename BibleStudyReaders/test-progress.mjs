import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kjwyabpruzdzmihbebmj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqd3lhYnBydXpkem1paGJlYm1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2OTc1MjksImV4cCI6MjEwNTI3MzUyOX0.wWejeCI26e2XP6wSW-PqoDS--coFI08D4l1Qu0-LEiQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const profileId = 'dev-local';
  const planDayIds = ['b318ef06-c1e1-4dd3-bbd6-0789ad95126a'];
  const { data, error } = await supabase
    .from("reading_progress")
    .select("*")
    .eq("profile_id", profileId)
    .in("plan_day_id", planDayIds);
  console.log('Progress Data:', data);
  console.log('Progress Error:', error);
}

test();
