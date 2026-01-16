import { supabase } from '../lib/supabase';

export const authService = {
    // Sign up with Email/Password
    signUp: async (email, password, username) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: username, // Storing username in metadata
                    username: username
                }
            }
        });

        if (error) throw error;
        return data;
    },

    // Sign in with Email/Password
    signInWithPassword: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        return data;
    },

    // Sign in with OAuth (e.g., 'google', 'instagram')
    signInWithOAuth: async (provider) => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: window.location.origin
            }
        });

        if (error) throw error;
        return data;
    },

    // Sign out
    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    // Get current session
    getSession: async () => {
        const { data } = await supabase.auth.getSession();
        return data.session;
    },

    // Get current user (helper)
    getCurrentUser: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    // Listen for auth changes
    onAuthStateChange: (callback) => {
        return supabase.auth.onAuthStateChange(callback);
    }
};
