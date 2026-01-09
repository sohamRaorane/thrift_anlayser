import React, { useState } from 'react';
import { ArrowRight, Check, CheckCircle2 } from 'lucide-react';
import './VerificationTips.css';

const VerificationTips = () => {
    const [isApplied, setIsApplied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleApply = () => {
        setIsLoading(true);
        // Simulate API call or processing delay
        setTimeout(() => {
            setIsApplied(true);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="tips-shell">
            <h2 className="dashboard-title">Improvement Tips</h2>

            <div className="tips-list">
                <div className={`tip-row ${isApplied ? 'success' : ''}`}>
                    <div className="tip-main">
                        {isApplied ? (
                            <CheckCircle2 size={18} className="success-icon" />
                        ) : (
                            <span className="tip-bullet">•</span>
                        )}
                        <span className="tip-text">Add refund / return policy</span>
                    </div>
                    <div className="tip-sub">
                        {isApplied ? <Check size={14} className="success-arrow" /> : <ArrowRight size={14} className="arrow-icon" />}
                        <span>{isApplied ? 'Policy updated' : 'Increases buyer trust'}</span>
                    </div>
                </div>

                <div className={`tip-row ${isApplied ? 'success' : ''}`}>
                    <div className="tip-main">
                        {isApplied ? (
                            <CheckCircle2 size={18} className="success-icon" />
                        ) : (
                            <span className="tip-bullet">•</span>
                        )}
                        <span className="tip-text">Share delivery timeline</span>
                    </div>
                    <div className="tip-sub">
                        {isApplied ? <Check size={14} className="success-arrow" /> : <ArrowRight size={14} className="arrow-icon" />}
                        <span>{isApplied ? 'Timeline visible' : 'Reduces complaints'}</span>
                    </div>
                </div>

                <div className={`tip-row ${isApplied ? 'success' : ''}`}>
                    <div className="tip-main">
                        {isApplied ? (
                            <CheckCircle2 size={18} className="success-icon" />
                        ) : (
                            <span className="tip-bullet">•</span>
                        )}
                        <span className="tip-text">Enable COD (if possible)</span>
                    </div>
                    <div className="tip-sub">
                        {isApplied ? <Check size={14} className="success-arrow" /> : <ArrowRight size={14} className="arrow-icon" />}
                        <span>{isApplied ? 'COD Activated' : 'Improves DripScore'}</span>
                    </div>
                </div>
            </div>

            <div className="tips-actions">
                <button
                    className={`apply-btn ${isApplied ? 'applied' : ''}`}
                    onClick={handleApply}
                    disabled={isApplied || isLoading}
                >
                    {isLoading ? 'Applying...' : isApplied ? '[ Changes Applied ]' : '[ Apply Changes ]'}
                </button>
            </div>
        </div>
    );
};

export default VerificationTips;
