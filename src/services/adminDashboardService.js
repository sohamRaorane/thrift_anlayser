import { supabase } from '../lib/supabase';

export const adminDashboardService = {
    // 1. Get Dashboard Counts
    getDashboardStats: async () => {
        try {
            // A. Pending Verifications
            const { count: pendingVerifications, error: vError } = await supabase
                .from('vendors')
                .select('*', { count: 'exact', head: true })
                .eq('verification_status', 'pending');

            // B. Listings Awaiting Review
            const { count: pendingListings, error: lError } = await supabase
                .from('listings')
                .select('*', { count: 'exact', head: true })
                .eq('moderation_status', 'pending_review');

            // C. Flagged Reviews
            const { count: flaggedReviews, error: rError } = await supabase
                .from('reviews')
                .select('*', { count: 'exact', head: true })
                .or('is_flagged.eq.true,moderation_status.eq.flagged');

            if (vError) console.error("Error fetching verification count", vError);
            if (lError) console.error("Error fetching listings count", lError);
            if (rError) console.error("Error fetching reviews count", rError);

            return {
                pendingVerifications: pendingVerifications || 0,
                pendingListings: pendingListings || 0,
                flaggedReviews: flaggedReviews || 0
            };
        } catch (error) {
            console.error("Dashboard Stats Error:", error);
            return { pendingVerifications: 0, pendingListings: 0, flaggedReviews: 0 };
        }
    },

    // 2. Get Recent Activity Feed
    getRecentActivity: async () => {
        const { data, error } = await supabase
            .from('admin_activity_log')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) {
            console.error("Error fetching activity log:", error);
            return [];
        }
        return data;
    },

    // 3. Log an Action (Helper for other services)
    logAction: async (actionType, details, targetId = null) => {
        const { error } = await supabase
            .from('admin_activity_log')
            .insert({
                action_type: actionType,
                details: details,
                target_id: targetId
            });

        if (error) console.error("Failed to log admin action:", error);
    }
};
