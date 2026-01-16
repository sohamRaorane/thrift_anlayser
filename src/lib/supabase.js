import { createClient } from '@supabase/supabase-js'

// TODO: Replace these with your actual Supabase credentials
// You can find these in your Supabase project settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL 
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY 


export const supabase = createClient(supabaseUrl, supabaseAnonKey)
