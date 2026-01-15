import { supabase } from '../lib/supabase';
import { adminDashboardService } from './adminDashboardService';

export const marketplaceListingService = {
    // 1. Get Listings (Filtered by status)
    getListings: async (statusFilter = 'all') => {
        console.log('[MarketplaceService] getListings called with filter:', statusFilter); // Debug
        let query = supabase
            .from('listings')
            .select(`
                *,
                vendors (business_name, store_name)
            `)
            .order('created_at', { ascending: false });

        if (statusFilter !== 'all') {
            // Map frontend status to backend if needed, or assume they match
            // Frontend: 'pending', 'approved', 'rejected'
            // Backend: 'pending_review', 'approved', 'rejected'
            const dbStatus = statusFilter === 'pending' ? 'pending_review' : statusFilter;
            console.log('[MarketplaceService] Filtering by DB status:', dbStatus); // Debug
            query = query.eq('moderation_status', dbStatus);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching listings:", error);
            return [];
        }

        console.log('[MarketplaceService] Returning', data.length, 'listings'); // Debug
        return data.map(l => ({
            ...l,
            sellerName: l.vendors?.business_name || l.vendors?.store_name || 'Unknown Seller'
        }));
    },

    // 2. Approve Listing
    approveListing: async (listingId) => {
        const { error } = await supabase
            .from('listings')
            .update({ moderation_status: 'approved' })
            .eq('id', listingId);

        if (error) throw error;

        await adminDashboardService.logAction('APPROVE_LISTING', `Approved listing ID: ${listingId}`, listingId);
        return { success: true };
    },

    // 3. Reject Listing
    rejectListing: async (listingId, reason) => {
        const { error } = await supabase
            .from('listings')
            .update({
                moderation_status: 'rejected',
                admin_notes: reason
            })
            .eq('id', listingId);

        if (error) throw error;

        await adminDashboardService.logAction('REJECT_LISTING', `Rejected listing ID: ${listingId}`, listingId);
        return { success: true };
    }
};
