import { supabase } from '../lib/supabase';
import { adminDashboardService } from './adminDashboardService';

export const reviewsService = {
    // Submit a review
    submitReview: async (reviewData) => {
        const { data, error } = await supabase
            .from('reviews')
            .insert([reviewData])
            .select();

        if (error) throw error;

        // Log intent (optional, or rely on triggers)
        // adminDashboardService.logAction('NEW_REVIEW', `Review submitted for vendor ${reviewData.vendor_id}`);

        return data;
    },

    // Get reviews for a vendor
    getVendorReviews: async (vendorId) => {
        const { data, error } = await supabase
            .from('reviews')
            .select('*, reviewer_name, vendors(business_name, store_name)')
            // We can also join profiles if we wanted 'buyer:buyer_id(instagram_username)' 
            // but we added 'reviewer_name' to reviews table as a snapshot.
            .eq('vendor_id', vendorId)
            .eq('vendor_id', vendorId)
            .in('status', ['published', 'removed']) // Fetch published and removed (to show as flagged)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching vendor reviews", error);
            return [];
        }
        return data;
    }
};
