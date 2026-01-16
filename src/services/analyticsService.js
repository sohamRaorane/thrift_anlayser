import { supabase } from '../lib/supabase';

// Helper to classify complaints if 'type' column is missing
const classifyComplaint = (issue) => {
    const text = issue.toLowerCase();
    if (text.includes('delivery') || text.includes('shipping') || text.includes('tracking') || text.includes('late')) return 'Shipping';
    if (text.includes('item') || text.includes('product') || text.includes('size') || text.includes('color') || text.includes('fake')) return 'Product';
    return 'Other';
};

export const analyticsService = {
    // 1. Get Sellers List
    getSellers: async () => {
        const { data, error } = await supabase
            .from('vendors')
            .select('id, business_name, store_name, instagram_handle')
            .order('business_name', { ascending: true });

        if (error) {
            console.error('Error fetching sellers:', error);
            return [];
        }
        return data; // Return raw data so ReportStore can filter by fields
    },

    // 2. Get All Analytics for a Seller
    getSellerAnalytics: async (sellerId) => {
        const stats = {
            verification: { status: 'Unverified' },
            renewal: { status: 'Active' },
            activeComplaints: 0,
            deliveryTimeData: [],
            complaintTypes: [
                { name: 'Product', value: 0, color: '#111827' },
                { name: 'Shipping', value: 0, color: '#9ca3af' },
                { name: 'Other', value: 0, color: '#e5e7eb' }
            ],
            dripScoreHistory: [],
            performance: {
                satisfaction: 0,
                responseRate: 0
            }
        };

        try {
            // A. Verification & Renewal Status
            const { data: cert } = await supabase
                .from('seller_certifications')
                .select('*')
                .eq('seller_id', sellerId)
                .single();

            if (cert) {
                stats.verification.status = 'Verified'; // If they have a cert, they are likely verified
                stats.renewal.status = cert.status || 'Active';
            }

            // B. Active Complaints & Types
            const { data: tickets } = await supabase
                .from('complaint_tickets')
                .select('status, issue_summary')
                .eq('seller_id', sellerId);

            if (tickets) {
                // Active count
                stats.activeComplaints = tickets.filter(t => ['Open', 'In Review'].includes(t.status)).length;

                // Group by Type
                const types = { 'Product': 0, 'Shipping': 0, 'Other': 0 };
                tickets.forEach(t => {
                    const type = classifyComplaint(t.issue_summary || '');
                    types[type] = (types[type] || 0) + 1;
                });
                stats.complaintTypes = [
                    { name: 'Product', value: types['Product'], color: '#111827' },
                    { name: 'Shipping', value: types['Shipping'], color: '#9ca3af' },
                    { name: 'Other', value: types['Other'], color: '#e5e7eb' }
                ];
            }

            // C. Delivery Metrics
            const { data: delivery } = await supabase
                .from('seller_delivery_metrics')
                .select('week_label, avg_delivery_days')
                .eq('seller_id', sellerId)
                .order('week_label', { ascending: true }); // Ideally sort by date column if exists

            if (delivery) {
                stats.deliveryTimeData = delivery.map(d => ({ name: d.week_label, days: Number(d.avg_delivery_days) }));
            }

            // D. DripScore History
            const { data: history } = await supabase
                .from('seller_dripscore_history')
                .select('period_label, score')
                .eq('seller_id', sellerId)
                // .order('created_at', { ascending: true }) // Assuming created_at order works for now
                .limit(10);

            if (history) {
                stats.dripScoreHistory = history.map(h => ({ name: h.period_label, score: Number(h.score) }));
            }

            // E. Performance Metrics (Simulated from real data logic or random if mostly empty)
            // Calculating simple "Response Rate" -> % of tickets NOT 'Open'
            const totalTickets = tickets?.length || 0;
            const respondedTickets = tickets?.filter(t => t.status !== 'Open').length || 0;
            stats.performance.responseRate = totalTickets > 0 ? Math.round((respondedTickets / totalTickets) * 100) : 100;

            // Satisfaction - random for now as we lack reviews table, or base on DripScore
            const latestScore = stats.dripScoreHistory.length > 0 ? stats.dripScoreHistory[stats.dripScoreHistory.length - 1].score : 4.5;
            stats.performance.satisfaction = Math.round((latestScore / 5) * 100);

        } catch (error) {
            console.error("Error loading analytics:", error);
        }

        return stats;
    }
};
