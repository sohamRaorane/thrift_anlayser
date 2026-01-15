import { supabase } from '../lib/supabase';
import { adminDashboardService } from './adminDashboardService';

export const marketplaceModerationService = {
    // 1. Get Listings Pending Review
    getPendingListings: async () => {
        const { data, error } = await supabase
            .from('listings')
            .select(`
                *,
                vendors (
                    id, 
                    business_name,
                    instagram_handle
                )
            `)
            .eq('moderation_status', 'pending_review')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching listings:", error);
            return [];
        }
        return data.map(item => ({
            ...item,
            sellerName: item.vendors?.business_name || 'Unknown Seller'
        }));
    },

    // 2. Approve Listing
    approveListing: async (listingId, title) => {
        const { error } = await supabase
            .from('listings')
            .update({ moderation_status: 'approved' })
            .eq('id', listingId);

        if (error) throw error;

        await adminDashboardService.logAction('APPROVE_LISTING', `Approved listing: ${title}`, listingId);
        return { success: true };
    },

    // 3. Reject Listing
    rejectListing: async (listingId, title) => {
        const { error } = await supabase
            .from('listings')
            .update({ moderation_status: 'rejected' })
            .eq('id', listingId);

        if (error) throw error;

        await adminDashboardService.logAction('REJECT_LISTING', `Rejected listing: ${title}`, listingId);
        return { success: true };
    }
};
