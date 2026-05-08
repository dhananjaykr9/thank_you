import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://icadnapxcvzgvilokihh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljYWRuYXB4Y3Z6Z3ZpbG9raWhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MTMyNjIsImV4cCI6MjA5MTI4OTI2Mn0.4I4mZqnTA2t1Ldc4rqzf055jCaEXHSEc5njUt9Hqrdg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function finalCheck() {
  console.log('--- FINAL DATABASE CHECK ---');
  const { data: wishers, error: fetchError } = await supabase
    .from('wishers')
    .select('*');

  if (fetchError) {
    console.error('Fetch Error:', fetchError.message);
    return;
  }

  console.log('Current records in DB:', JSON.stringify(wishers, null, 2));
  
  if (wishers.length > 0) {
    console.log('RECORDS STILL EXIST. Attempting brute force delete...');
    const { error: deleteError } = await supabase
      .from('wishers')
      .delete()
      .not('name', 'eq', 'literally_anything_impossible_name_12345'); // Standard way to select all rows in Supabase RLS delete

    if (deleteError) {
      console.error('Delete Error:', deleteError.message);
    } else {
      console.log('Delete command sent.');
      // Double check after delete
      const { data: checkData } = await supabase.from('wishers').select('*');
      console.log('Post-delete check count:', checkData?.length);
    }
  } else {
    console.log('Database is confirmed empty at the API level.');
  }
}

finalCheck();
