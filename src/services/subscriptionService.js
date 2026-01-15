import { supabase } from '../lib/supabase';

export const subscriptionService = {
    // 1. Get all available plans
    getPlans: async () => {
        const { data, error } = await supabase
            .from('plans')
            .select('*')
            .eq('is_active', true)
            .order('price_monthly', { ascending: true });

        if (error) {
            console.error('Error fetching plans:', error);
            return [];
        }
        return data;
    },

    // 2. Get Seller Subscription & Details
    getSellerSubscription: async (sellerId) => {
        const { data, error } = await supabase
            .from('seller_subscriptions')
            .select(`
                *,
                plans (*)
            `)
            .eq('seller_id', sellerId)
            .single();

        if (error) {
            // It's okay if no subscription exists yet, we'll return null
            if (error.code !== 'PGRST116') {
                console.error('Error fetching subscription:', error);
            }
            return null;
        }
        return data;
    },

    // 3. Upsert Subscription (Create or Update)
    updateSubscription: async (sellerId, planId, promoData, metaData) => {
        const { data, error } = await supabase
            .from('seller_subscriptions')
            .upsert({
                seller_id: sellerId,
                plan_id: planId,
                promo_active_campaign: promoData.campaign,
                promo_visibility_boost: promoData.boost,
                promo_click_tracking: promoData.tracking,
                custom_note: metaData.note,
                discount_code: metaData.discount,
                billing_reference: metaData.billingRef,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // 4. Get Seller ROI
    getROIReport: async (sellerId) => {
        const { data, error } = await supabase
            .from('seller_roi_reports')
            .select('*')
            .eq('seller_id', sellerId)
            .single();

        if (error) {
            // Return zeroes if no data found
            return { views_count: 0, leads_count: 0, conversations_count: 0 };
        }
        return data;
    },

    // 5. Helper: seed dummy ROI if missing (for demo purposes)
    ensureROIExists: async (sellerId) => {
        const { data } = await supabase.from('seller_roi_reports').select('id').eq('seller_id', sellerId).single();
        if (!data) {
            await supabase.from('seller_roi_reports').insert({
                seller_id: sellerId,
                views_count: Math.floor(Math.random() * 5000) + 100,
                leads_count: Math.floor(Math.random() * 500) + 10,
                conversations_count: Math.floor(Math.random() * 100) + 5
            });
        }
    },

    // 6. Get Sellers List (Real UUIDs)
    getSellers: async () => {
        // Correct column is 'business_name', falling back to 'instagram_handle'
        const { data, error } = await supabase
            .from('vendors')
            .select('id, business_name, instagram_handle')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching vendors:', error);
            return [];
        }
        return data ? data.map(v => ({
            id: v.id,
            name: v.business_name || v.instagram_handle || 'Unnamed Vendor'
        })) : [];
    }
};
