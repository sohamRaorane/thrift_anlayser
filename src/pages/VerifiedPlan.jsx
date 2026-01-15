import React, { useState, useEffect } from 'react';
import { Check, Star, ShieldCheck, Zap, BarChart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { subscriptionService } from '../services/subscriptionService';
import './VerifiedPlan.css';

const VerifiedPlan = () => {
    const [loading, setLoading] = useState(true);
    const [currentSubscription, setCurrentSubscription] = useState(null);
    const [activePlan, setActivePlan] = useState(null);
    const [promotions, setPromotions] = useState({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const subData = await subscriptionService.getSellerSubscription(user.id);

            if (subData) {
                setCurrentSubscription(subData);
                setActivePlan(subData.plans);
                setPromotions({
                    campaign: subData.promo_active_campaign,
                    boost: subData.promo_visibility_boost,
                    tracking: subData.promo_click_tracking
                });
            } else {
                setActivePlan({ name: 'Free', price_monthly: 0, features: ['Basic Listing'] });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async () => {
        if (!window.confirm("Contact support to downgrade your plan.")) return;
        // Real downgrading would involve payment logic, keeping it simple for now
    };

    if (loading) return <div className="plan-shell">Loading plan details...</div>;

    const isPaidPlan = activePlan?.price_monthly > 0;

    return (
        <div className="plan-shell">
            <div className={`plan-card ${isPaidPlan ? 'verified-card' : ''}`}>
                <div className="plan-header">
                    <span className="current-status-label">Current Plan</span>
                    <div className="plan-title-row">
                        {isPaidPlan ? (
                            <>
                                <h2 className="plan-name verified-text">{activePlan?.name || 'Verified Plan'}</h2>
                                <div className="verified-badge-large">
                                    <Star size={16} fill="white" stroke="none" />
                                    <span>ACTIVE</span>
                                </div>
                            </>
                        ) : (
                            <h3 className="plan-name">{activePlan?.name || 'Free Tier'}</h3>
                        )}
                    </div>
                    {isPaidPlan && <div style={{ marginTop: '4px', opacity: 0.8 }}>₹{activePlan?.price_monthly}/mo</div>}
                </div>

                <div className="plan-divider"></div>

                <div className="plan-content">
                    {/* Active Promotions Badges */}
                    {(promotions.campaign || promotions.boost || promotions.tracking) && (
                        <div className="content-block" style={{ marginBottom: '1.5rem' }}>
                            <h3 className="upgrade-title" style={{ marginBottom: '10px' }}>Active Promotions:</h3>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {promotions.campaign && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', padding: '6px 12px', background: '#d1fae5', color: '#065f46', borderRadius: '50px', fontWeight: '600' }}>
                                        <Zap size={14} /> Campaign
                                    </div>
                                )}
                                {promotions.boost && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', padding: '6px 12px', background: '#dbeafe', color: '#1e40af', borderRadius: '50px', fontWeight: '600' }}>
                                        <BarChart size={14} /> Boost
                                    </div>
                                )}
                                {promotions.tracking && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', padding: '6px 12px', background: '#f3f4f6', color: '#374151', borderRadius: '50px', fontWeight: '600' }}>
                                        <ShieldCheck size={14} /> Tracking
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="content-block">
                        <h3 className="upgrade-title">Included Features:</h3>
                        {activePlan?.features?.length > 0 ? (
                            activePlan.features.map((feature, idx) => (
                                <div key={idx} className="feature-row">
                                    <Check size={18} className="check-icon" />
                                    <span>{feature}</span>
                                </div>
                            ))
                        ) : (
                            <div className="feature-row">
                                <Check size={18} className="check-icon" />
                                <span>Standard Access</span>
                            </div>
                        )}
                    </div>

                    {!isPaidPlan && (
                        <div className="content-block upgrade-block">
                            <p className="description-text">Upgrade to "Pro Seller" or "Featured Vendor" to unlock more visibility and analytics.</p>
                        </div>
                    )}
                </div>

                <div className="plan-action">
                    {!isPaidPlan ? (
                        <button className="upgrade-btn">
                            Contact Admin to Upgrade
                        </button>
                    ) : (
                        <div className="active-plan-actions">
                            <button className="upgrade-btn disabled" disabled>
                                PLAN ACTIVE
                            </button>
                            <button className="deactivate-btn" onClick={handleDeactivate}>
                                Request Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifiedPlan;
