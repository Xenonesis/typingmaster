import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vyophpmybhlpkpnujohd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5b3BocG15YmhscGtwbnVqb2hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MDg4NjQsImV4cCI6MjA1OTA4NDg2NH0.Cf6mOglLPkZ805dBk3ctHqgxwjeIGRwGtlU8T5p0Dlw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 