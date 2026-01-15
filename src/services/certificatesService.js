import { supabase } from '../lib/supabase';

// Helper to determine status based on dates if not explicitly revoked/expired
const computeStatus = (cert) => {
    if (!cert) return 'Not Certified';
    if (cert.status === 'Revoked') return 'Revoked';

    // Check dates
    const now = new Date();
    const expiry = new Date(cert.expires_on);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Expired';
    if (diffDays <= 30) return 'Expiring Soon';
    return 'Active';
};

export const certificatesService = {
    // 1. Get All Certificates (merged with Vendors)
    getCertificates: async () => {
        // Fetch vendors
        const { data: vendors, error: vError } = await supabase
            .from('vendors')
            .select('id, business_name, instagram_handle')
            .order('business_name', { ascending: true });

        if (vError) {
            console.error('Error fetching vendors:', vError);
            return [];
        }

        // Fetch certifications
        const { data: certs, error: cError } = await supabase
            .from('seller_certifications')
            .select('*');

        if (cError) {
            console.error('Error fetching certs:', cError);
        }

        // Merge and Map
        return vendors.map(v => {
            const cert = certs?.find(c => c.seller_id === v.id);
            const computedStatus = computeStatus(cert);

            // Simple rating placeholder or mock until reviews table is linked
            // Assuming random realistic ratings for demo if real ones missing
            const rating = (4.0 + (Math.random() * 1.0)).toFixed(1);

            return {
                id: v.id, // Use seller_id as the key
                business: v.business_name || v.instagram_handle || 'Unnamed',
                status: computedStatus,
                certifiedOn: cert?.certified_on || '—',
                expiry: cert?.expires_on || '—',
                rating: rating,
                // Raw data for actions
                cert_id: cert?.id
            };
        });
    },

    // 2. Renew Certificate
    renewCertificate: async (sellerId) => {
        const today = new Date();
        const nextYear = new Date();
        nextYear.setFullYear(today.getFullYear() + 1);

        const certifiedOn = today.toISOString().split('T')[0];
        const expiresOn = nextYear.toISOString().split('T')[0];

        // Upsert: If exists update, else insert
        const { data, error } = await supabase
            .from('seller_certifications')
            .upsert({
                seller_id: sellerId,
                certified_on: certifiedOn,
                expires_on: expiresOn,
                status: 'Verified' // Reset status to Verified/Active
            }, { onConflict: 'seller_id' })
            .select()
            .single();

        if (error) throw error;

        // Return formatted object for UI update
        return {
            id: sellerId,
            status: 'Active',
            certifiedOn: certifiedOn,
            expiry: expiresOn,
            cert_id: data.id
        };
    },

    // 3. Revoke Certificate
    revokeCertificate: async (sellerId) => {
        // Update status to Revoked
        const { data, error } = await supabase
            .from('seller_certifications')
            .update({ status: 'Revoked' })
            .eq('seller_id', sellerId)
            .select()
            .single();

        if (error) throw error;

        return {
            id: sellerId,
            status: 'Revoked'
        };
    }
};
