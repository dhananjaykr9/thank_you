import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create client if valid URL is provided
export const supabase = supabaseUrl.startsWith('http') && supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key_here'
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
