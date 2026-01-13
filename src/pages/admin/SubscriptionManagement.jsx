import React from 'react';

const SubscriptionManagement = () => {
    return (
        <div className="sub-container">
            <h2 className="page-title">// SUBSCRIPTION AND PROMOTION</h2>

            <div className="sub-grid">
                {/* Left: Subscription Plan */}
                <div className="sub-box plans-section">
                    <h3>SUBSCRIPTION PLAN</h3>

                    <div className="plans-row">
                        <div className="plan-card">
                            <h4>Free plan</h4>
                        </div>
                        <div className="plan-card">
                            <h4>Pro Seller</h4>
                        </div>
                        <div className="plan-card">
                            <h4>Featured Vendor</h4>
                        </div>
                    </div>

                    <div className="plan-actions">
                        <button className="manage-btn">Manage Pricing</button>
                        <button className="manage-btn">Manage Validity</button>
                        <button className="manage-btn">Resume Plans</button>
                    </div>
                </div>

                {/* Right: Sponsored Promotions */}
                <div className="sub-box promotions-section">
                    <h3>SPONSORED PROMOTIONS</h3>

                    <div className="circles-row">
                        <div className="circle-stat">Active Campaign</div>
                        <div className="circle-stat">Visibility Boost</div>
                        <div className="circle-stat">Click Tracking</div>
                    </div>

                    <div className="roi-section">
                        <h4>ROI REPORTS</h4>
                        <div className="roi-card">VIEWS</div>
                        <div className="roi-card">LEADS</div>
                        <div className="roi-card">CONVERSIONS</div>
                    </div>
                </div>
            </div>

            <style>{`
        .sub-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .sub-box {
          border: 2px solid #000; border-radius: 20px; padding: 24px;
          display: flex; flex-direction: column; gap: 20px;
        }
        .sub-box h3 { text-align: center; text-transform: uppercase; margin-top: 0; }

        /* Plans */
        .plans-row { display: flex; gap: 12px; height: 180px; }
        .plan-card {
           flex: 1; border: 2px solid #000; border-radius: 16px;
           display: flex; align-items: center; justify-content: center;
           font-weight: 700; text-align: center;
        }
        
        .plan-actions { display: flex; flex-direction: column; gap: 12px; }
        .manage-btn {
           border: 2px solid #000; border-radius: 12px; padding: 12px;
           background: #fff; font-weight: 700; cursor: pointer;
        }

        /* Promotions */
        .circles-row { display: flex; justify-content: center; gap: 16px; }
        .circle-stat {
          width: 90px; height: 90px; border-radius: 50%; border: 2px solid #000;
          display: flex; align-items: center; justify-content: center;
          text-align: center; font-size: 11px; font-weight: 700; padding: 4px;
        }

        .roi-section {
          border: 2px solid #000; border-radius: 16px; padding: 16px;
          flex: 1; display: flex; flex-direction: column;
        }
        .roi-section h4 { text-align: center; margin: 0 0 12px 0; }
        .roi-card {
           border: 2px solid #000; border-radius: 12px; padding: 12px;
           margin-bottom: 8px; text-align: center; font-weight: 700;
        }
      `}</style>
        </div>
    );
};

export default SubscriptionManagement;
