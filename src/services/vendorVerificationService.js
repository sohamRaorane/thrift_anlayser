import { supabase } from '../lib/supabase';
import { adminDashboardService } from './adminDashboardService';

export const vendorVerificationService = {
    // 1. Get Verifications (Filtered by status)
    getVerifications: async (statusFilter = 'pending') => {
        let query = supabase
            .from('vendors')
            .select('*, business_name, store_name')
            .order('verification_submitted_at', { ascending: true }); // Oldest first

        if (statusFilter !== 'all') {
            // Map UI filter to DB status
            // UI: 'pending', 'approved', 'rejected'
            // DB: 'pending', 'verified', 'rejected'
            const dbStatus = statusFilter === 'approved' ? 'verified' : statusFilter;
            query = query.eq('verification_status', dbStatus);
        } else {
            // For 'all', exclude unverified vendors
            query = query.neq('verification_status', 'unverified');
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching verifications:", error);
            return [];
        }
        return data;
    },

    // 2. Approve Vendor
    approveVendor: async (vendorId, businessName) => {
        // A. Update Vendor Status
        const { error: vError } = await supabase
            .from('vendors')
            .update({
                verification_status: 'verified'
            })
            .eq('id', vendorId);

        if (vError) throw vError;

        // B. Ensure Certificate Exists (Create if not) - Wrapped in try-catch as it might be a separate module
        try {
            const { data: cert } = await supabase
                .from('seller_certifications')
                .select('id')
                .eq('seller_id', vendorId)
                .maybeSingle();

            if (!cert) {
                const today = new Date();
                const nextYear = new Date();
                nextYear.setFullYear(today.getFullYear() + 1);

                await supabase
                    .from('seller_certifications')
                    .insert({
                        seller_id: vendorId,
                        certified_on: today.toISOString().split('T')[0],
                        expires_on: nextYear.toISOString().split('T')[0],
                        status: 'Verified'
                    });
            }
        } catch (cError) {
            console.warn("Seller certification table error (skipping):", cError.message);
        }

        // C. Log Action
        await adminDashboardService.logAction('VERIFY_VENDOR', `Verified vendor: ${businessName}`, vendorId);

        return { success: true };
    },

    // 3. Reject Vendor
    rejectVendor: async (vendorId, businessName, reason) => {
        const { error } = await supabase
            .from('vendors')
            .update({
                verification_status: 'rejected'
            })
            .eq('id', vendorId);

        if (error) throw error;

        // Log Action
        await adminDashboardService.logAction('REJECT_VENDOR', `Rejected vendor: ${businessName}. Reason: ${reason}`, vendorId);

        return { success: true };
    }
};
