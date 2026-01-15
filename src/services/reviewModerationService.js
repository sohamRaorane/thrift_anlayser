import { supabase } from '../lib/supabase';
import { adminDashboardService } from './adminDashboardService';

export const reviewModerationService = {
    // 1. Get Flagged/All Reviews
    getReviews: async (filter = 'flagged') => {
        let query = supabase
            .from('reviews')
            .select(`
                *,
                vendors (business_name, store_name)
            `)
            .order('created_at', { ascending: false });

        if (filter === 'flagged') {
            query = query.or('is_flagged.eq.true,moderation_status.eq.flagged');
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching reviews:", error);
            return [];
        }
        return data.map(r => ({
            ...r,
            vendorName: r.vendors?.business_name || r.vendors?.store_name || 'Unknown Store'
        }));
    },

    // 2. Remove Review (Soft Delete or Status Update)
    removeReview: async (reviewId) => {
        const { error } = await supabase
            .from('reviews')
            .update({ moderation_status: 'removed', is_flagged: false })
            .eq('id', reviewId);

        if (error) throw error;

        await adminDashboardService.logAction('REMOVE_REVIEW', `Removed review ID: ${reviewId}`, reviewId);
        return { success: true };
    },

    // 3. Mark Safe (Dismiss Flag)
    markSafe: async (reviewId) => {
        const { error } = await supabase
            .from('reviews')
            .update({ moderation_status: 'published', is_flagged: false })
            .eq('id', reviewId);

        if (error) throw error;
        return { success: true };
    }
};
