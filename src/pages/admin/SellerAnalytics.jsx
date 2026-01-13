import React from 'react';

const SellerAnalytics = () => {
    return (
        <div className="analytics-container">
            <h2 className="page-title">// SELLER DASHBOARD {'{ADMIN}'}</h2>

            <div className="dashboard-grid-layout">
                {/* Left Stats Sidebar */}
                <div className="stats-sidebar">
                    <div className="stat-card">
                        <h4>Verification Status</h4>
                        <div className="status-indicator active">Verified</div>
                    </div>
                    <div className="stat-card">
                        <h4>Renewal Status</h4>
                        <div className="status-indicator warning">Review Due</div>
                    </div>
                    <div className="stat-card">
                        <h4>Active Complaints</h4>
                        <div className="big-number">02</div>
                    </div>
                </div>

                {/* Main Analytics Area */}
                <div className="main-analytics">

                    {/* Delivery Trends */}
                    <div className="analytics-card wide">
                        <h3>Delivery Time Trends</h3>
                        <div className="chart-placeholder bar-chart">
                            {/* Mock Bar Chart Visual */}
                            <div className="bar" style={{ height: '40%' }}></div>
                            <div className="bar" style={{ height: '60%' }}></div>
                            <div className="bar" style={{ height: '45%' }}></div>
                            <div className="bar" style={{ height: '80%' }}></div>
                            <div className="bar" style={{ height: '30%' }}></div>
                            <div className="bar" style={{ height: '65%' }}></div>
                            <div className="bar" style={{ height: '50%' }}></div>
                        </div>
                    </div>

                    {/* DripScore & Pie */}
                    <div className="analytics-row">
                        <div className="analytics-card score-card">
                            <h3>Review DripScore History</h3>
                            <div className="score-details">
                                <span>Last Month: 88</span>
                                <span>Current: 92</span>
                            </div>
                        </div>

                        <div className="analytics-card pie-card">
                            {/* CSS Pie Chart */}
                            <div className="pie-chart"></div>
                        </div>
                    </div>

                    {/* Customer Satisfaction */}
                    <div className="analytics-card wide">
                        <h3>Customer Satisfaction</h3>
                        <div className="progress-bars">
                            <div className="p-bar"><div className="fill" style={{ width: '92%' }}></div></div>
                        </div>
                    </div>

                    {/* Response Metrics */}
                    <div className="analytics-card wide">
                        <h3>Response to Complaints</h3>
                        <div className="progress-bars">
                            <div className="p-bar"><div className="fill" style={{ width: '78%' }}></div></div>
                        </div>
                    </div>

                </div>
            </div>

            <style>{`
        .dashboard-grid-layout {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 24px;
        }

        /* Stats Sidebar */
        .stats-sidebar { display: flex; flex-direction: column; gap: 16px; }
        .stat-card {
          border: 2px solid #000; border-radius: 12px; padding: 16px; background: #fff;
          text-align: center;
        }
        .stat-card h4 { margin: 0 0 12px 0; font-size: 13px; color: #718096; }
        .status-indicator {
          display: inline-block; padding: 6px 12px; border-radius: 20px;
          font-weight: 700; font-size: 12px; border: 1px solid #000;
        }
        .status-indicator.active { background: #c6f6d5; }
        .status-indicator.warning { background: #feebc8; }
        .big-number { font-size: 32px; font-weight: 800; }

        /* Main Analytics */
        .main-analytics { display: flex; flex-direction: column; gap: 16px; }
        .analytics-card {
           border: 2px solid #000; border-radius: 16px; padding: 20px; background: #fff;
        }
        .analytics-card h3 { margin-top: 0; font-size: 16px; }
        
        .chart-placeholder.bar-chart {
          height: 120px; display: flex; align-items: flex-end; gap: 12px;
          border-bottom: 2px solid #e2e8f0; padding-bottom: 4px;
        }
        .bar { width: 30px; background: #000; border-radius: 4px 4px 0 0; opacity: 0.7; }
        
        .analytics-row { display: flex; gap: 16px; }
        .score-card { flex: 2; }
        .pie-card { flex: 1; display: flex; align-items: center; justify-content: center; }
        
        .pie-chart {
          width: 80px; height: 80px; border-radius: 50%;
          background: conic-gradient(#000 0% 75%, #e2e8f0 75% 100%);
          border: 2px solid #000;
        }

        .progress-bars { margin-top: 12px; }
        .p-bar { height: 24px; background: #edf2f7; border-radius: 12px; overflow: hidden; border: 1px solid #cbd5e0; }
        .fill { height: 100%; background: #000; }

      `}</style>
        </div>
    );
};

export default SellerAnalytics;
