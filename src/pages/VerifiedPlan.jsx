import React, { useState, useEffect } from 'react';
import { Check, Star, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './VerifiedPlan.css';

const VerifiedPlan = () => {
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.user_metadata?.plan === 'verified') {
            setIsVerified(true);
        }
        setLoading(false);
    };

    const handleUpgrade = async () => {
        setLoading(true);
        // Simulate payment processing...
        setTimeout(async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.auth.updateUser({
                    data: { plan: 'verified' }
                });
                setIsVerified(true);
                // Force a reload or notify parent to update dashboard header
                window.location.reload();
            }
            setLoading(false);
        }, 1500);
    };

    const handleDeactivate = async () => {
        if (!window.confirm("Are you sure you want to cancel your verified plan? You will lose access to premium features.")) {
            return;
        }
        setLoading(true);
        // Simulate processing...
        setTimeout(async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.auth.updateUser({
                    data: { plan: 'free' }
                });
                setIsVerified(false);
                window.location.reload();
            }
            setLoading(false);
        }, 1000);
    };

    if (loading) return <div className="plan-shell">Loading...</div>;

    return (
        <div className="plan-shell">
            <div className={`plan-card ${isVerified ? 'verified-card' : ''}`}>
                <div className="plan-header">
                    <span className="current-status-label">Current Plan</span>
                    <div className="plan-title-row">
                        {isVerified ? (
                            <>
                                <h2 className="plan-name verified-text">FAD Verified</h2>
                                <div className="verified-badge-large">
                                    <Star size={16} fill="white" stroke="none" />
                                    <span>OFFICIAL</span>
                                </div>
                            </>
                        ) : (
                            <h3 className="plan-name">Free Tier</h3>
                        )}
                    </div>
                </div>

                <div className="plan-divider"></div>

                <div className="plan-content">
                    <div className="content-block">
                        <div className="feature-row">
                            <ShieldCheck size={18} className="check-icon" />
                            <span>Ownership verification {isVerified && '(Active)'}</span>
                        </div>
                        <div className="feature-row">
                            <ShieldCheck size={18} className="check-icon" />
                            <span>Basic DripScore {isVerified && '(Active)'}</span>
                        </div>
                    </div>

                    {!isVerified && (
                        <div className="content-block upgrade-block">
                            <h3 className="upgrade-title">Upgrade benefits:</h3>
                            <ul className="upgrade-list">
                                <li>Higher visibility</li>
                                <li>Priority support</li>
                                <li>Advanced analytics</li>
                            </ul>
                        </div>
                    )}

                    {isVerified && (
                        <div className="content-block upgrade-block">
                            <h3 className="upgrade-title">Your benefits are active.</h3>
                            <p className="description-text">You now have access to premium features in the dashboard.</p>
                        </div>
                    )}
                </div>

                <div className="plan-action">
                    {!isVerified ? (
                        <button className="upgrade-btn" onClick={handleUpgrade}>
                            UPGRADE NOW!
                        </button>
                    ) : (
                        <div className="active-plan-actions">
                            <button className="upgrade-btn disabled" disabled>
                                PLAN ACTIVE
                            </button>
                            <button className="deactivate-btn" onClick={handleDeactivate}>
                                Deactivate Plan
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifiedPlan;
