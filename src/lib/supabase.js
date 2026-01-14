import { createClient } from '@supabase/supabase-js'

// TODO: Replace these with your actual Supabase credentials
// You can find these in your Supabase project settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

console.log('Supabase Config:', {
    url: import.meta.env.VITE_SUPABASE_URL ? 'Loaded' : 'Missing',
    fallbackUrl: supabaseUrl,
    hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
})

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
