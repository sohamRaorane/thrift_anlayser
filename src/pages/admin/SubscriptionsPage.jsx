import React, { useState, useEffect } from 'react';
import { subscriptionService } from '../../services/subscriptionService';
import { Check, TrendingUp, Users, MessageSquare, Loader, Zap, BarChart, ShieldCheck } from 'lucide-react';
import './AdminLayout.css';

const SubscriptionsPage = () => {
    // State management
    const [sellers, setSellers] = useState([]);
    const [plans, setPlans] = useState([]);

    const [selectedSellerId, setSelectedSellerId] = useState('');
    const [selectedPlanId, setSelectedPlanId] = useState('');

    const [promotions, setPromotions] = useState({
        campaign: false,
        boost: false,
        tracking: false
    });

    const [metaData, setMetaData] = useState({
        note: '',
        discount: '',
        billingRef: ''
    });

    const [roiData, setRoiData] = useState({ views_count: 0, leads_count: 0, conversations_count: 0 });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // 1. Initial Load: Sellers & Plans
    useEffect(() => {
        const loadInitData = async () => {
            const [sellersList, plansList] = await Promise.all([
                subscriptionService.getSellers(),
                subscriptionService.getPlans()
            ]);
            setSellers(sellersList);
            setPlans(plansList);

            if (sellersList.length > 0) {
                setSelectedSellerId(sellersList[0].id);
            }
            setInitialLoading(false);
        };
        loadInitData();
    }, []);

    // 2. Fetch Subscription & ROI on Seller Change
    useEffect(() => {
        if (!selectedSellerId) return;
        loadSellerData(selectedSellerId);
    }, [selectedSellerId]);

    const loadSellerData = async (sellerId) => {
        setLoading(true);
        try {
            // Load Subscription
            const subData = await subscriptionService.getSellerSubscription(sellerId);

            if (subData) {
                setSelectedPlanId(subData.plan_id);
                setPromotions({
                    campaign: subData.promo_active_campaign || false,
                    boost: subData.promo_visibility_boost || false,
                    tracking: subData.promo_click_tracking || false
                });
                setMetaData({
                    note: subData.custom_note || '',
                    discount: subData.discount_code || '',
                    billingRef: subData.billing_reference || ''
                });
            } else {
                if (plans.length > 0) setSelectedPlanId(plans[0].id);
                setPromotions({ campaign: false, boost: false, tracking: false });
                setMetaData({ note: '', discount: '', billingRef: '' });
            }

            await subscriptionService.ensureROIExists(sellerId);
            const roi = await subscriptionService.getROIReport(sellerId);
            setRoiData(roi);

        } catch (error) {
            console.error("Error loading seller data", error);
            // Silent error or toast if needed, but alert is too intrusive for auto-fetch
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!selectedSellerId || !selectedPlanId) {
            alert("Please select a seller and a plan.");
            return;
        }

        setLoading(true);
        try {
            await subscriptionService.updateSubscription(
                selectedSellerId,
                selectedPlanId,
                promotions,
                metaData
            );
            alert('Plan and promotions saved successfully!');
            loadSellerData(selectedSellerId);
        } catch (error) {
            console.error("Save failed", error);
            alert("Failed to save changes. Check console.");
        } finally {
            setLoading(false);
        }
    };

    const togglePromo = (key) => {
        if (!selectedSellerId) return;
        setPromotions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (initialLoading) {
        return <div className="admin-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
    }

    return (
        <div className="subscriptions-page">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Subscription & Promotion</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>

                {/* Left Block: Subscription Plans */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Seller Selector */}
                    <div className="admin-card">
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                            MANAGE SUBSCRIPTION FOR:
                        </label>
                        <select
                            value={selectedSellerId}
                            onChange={(e) => setSelectedSellerId(e.target.value)}
                            disabled={loading}
                            style={{
                                padding: '10px',
                                borderRadius: '6px',
                                border: '1px solid #d1d5db',
                                width: '100%',
                                fontSize: '1rem',
                                backgroundColor: loading ? '#f3f4f6' : 'white'
                            }}
                        >
                            {sellers.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                        {sellers.length === 0 && <div style={{ fontSize: '0.8rem', color: 'red', marginTop: '4px' }}>No vendors found in DB. Run seed_vendors.sql</div>}
                    </div>

                    <div className="admin-card">
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>
                            SELECT PLAN TIER
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            {plans.map(plan => {
                                const isSelected = selectedPlanId === plan.id;
                                return (
                                    <div
                                        key={plan.id}
                                        onClick={() => !loading && setSelectedPlanId(plan.id)}
                                        style={{
                                            padding: '1.5rem 1rem',
                                            border: isSelected ? '2px solid #111827' : '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            backgroundColor: isSelected ? '#f9fafb' : 'white',
                                            cursor: loading ? 'wait' : 'pointer',
                                            textAlign: 'left',
                                            transition: 'all 0.2s',
                                            position: 'relative',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '8px'
                                        }}
                                    >
                                        {isSelected && <div style={{ position: 'absolute', top: '12px', right: '12px' }}><Check size={18} /></div>}

                                        <div>
                                            <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '2px' }}>{plan.name}</div>
                                            <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>
                                                {plan.price_monthly === 0 ? 'Free' : `₹${plan.price_monthly.toLocaleString()}/mo`}
                                            </div>
                                        </div>

                                        <div style={{ borderTop: '1px solid #e5e7eb', margin: '8px 0' }}></div>

                                        <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.4' }}>
                                            {plan.features.map((feat, idx) => (
                                                <li key={idx} style={{ marginBottom: '4px' }}>{feat}</li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Feature Inputs */}
                    <div className="admin-card">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#6b7280' }}>Custom Label / Note</label>
                                <input
                                    type="text"
                                    value={metaData.note}
                                    onChange={e => setMetaData({ ...metaData, note: e.target.value })}
                                    placeholder="e.g. Summer special deal"
                                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', marginTop: '4px' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#6b7280' }}>Discount Code (Optional)</label>
                                <input
                                    type="text"
                                    value={metaData.discount}
                                    onChange={e => setMetaData({ ...metaData, discount: e.target.value })}
                                    placeholder="e.g. THRIFT20"
                                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', marginTop: '4px' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#6b7280' }}>Billing Reference</label>
                                <input
                                    type="text"
                                    value={metaData.billingRef}
                                    onChange={e => setMetaData({ ...metaData, billingRef: e.target.value })}
                                    placeholder="#INV-2023-..."
                                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', marginTop: '4px' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Block: Sponsored Promotions & ROI */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Sponsored Promotions */}
                    <div className="admin-card">
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.5rem', color: '#111827' }}>Sponsored Promotions</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { key: 'campaign', label: 'Active Campaign', icon: <Zap size={16} /> },
                                { key: 'boost', label: 'Visibility Boost', icon: <BarChart size={16} /> },
                                { key: 'tracking', label: 'Click Tracking', icon: <ShieldCheck size={16} /> }
                            ].map(promo => {
                                const isActive = promotions[promo.key];
                                return (
                                    <div
                                        key={promo.key}
                                        onClick={() => togglePromo(promo.key)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '12px 16px',
                                            borderRadius: '8px',
                                            border: isActive ? '2px solid #111827' : '1px solid #e5e7eb',
                                            backgroundColor: isActive ? '#f9fafb' : 'white',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ color: isActive ? '#111827' : '#9ca3af' }}>{promo.icon}</div>
                                            <span style={{ fontWeight: '600', color: isActive ? '#111827' : '#6b7280' }}>{promo.label}</span>
                                        </div>
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            border: '2px solid',
                                            borderColor: isActive ? '#111827' : '#d1d5db',
                                            backgroundColor: isActive ? '#111827' : 'transparent',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {isActive && <Check size={12} color="white" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ROI Data */}
                    <div className="admin-card">
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <TrendingUp size={20} />
                            ROI Real-time Data
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Users size={18} color="#6b7280" />
                                    <span style={{ fontWeight: '500', color: '#374151' }}>Total Views</span>
                                </div>
                                <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{roiData.views_count.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Check size={18} color="#6b7280" />
                                    <span style={{ fontWeight: '500', color: '#374151' }}>Qualified Leads</span>
                                </div>
                                <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{roiData.leads_count.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <MessageSquare size={18} color="#6b7280" />
                                    <span style={{ fontWeight: '500', color: '#374151' }}>Conversations</span>
                                </div>
                                <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{roiData.conversations_count.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        style={{
                            padding: '1rem',
                            backgroundColor: '#111827',
                            color: 'white',
                            fontWeight: '600',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.8 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        {loading && <Loader size={18} className="spin" />}
                        {loading ? 'Saving...' : 'Save Subscription Changes'}
                    </button>
                    <style>{`
                        .spin { animation: spin 1s linear infinite; }
                        @keyframes spin { 100% { transform: rotate(360deg); } }
                    `}</style>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionsPage;
