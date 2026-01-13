import React from 'react';

const CertificateManagement = () => {
    const certifiedBusinesses = [
        { name: "XYZ Vintage", status: "Active", certifiedOn: "12 Jan 2024", expiry: "12 Jan 2025", reviews: 4.8 },
        { name: "ABC Threads", status: "Active", certifiedOn: "10 Feb 2024", expiry: "10 Feb 2025", reviews: 4.5 },
        { name: "LMN Thrift", status: "Expiring Soon", certifiedOn: "01 Mar 2023", expiry: "01 Mar 2024", reviews: 4.9 },
    ];

    return (
        <div className="certificate-container">
            <h2 className="page-title">// FAD CERTIFICATE MANAGEMENT</h2>

            {/* Top List Box */}
            <div className="section-box top-list">
                <h3>Certified Businesses Detailed List</h3>
                <ol>
                    {certifiedBusinesses.map((b, i) => (
                        <li key={i}>{b.name}</li>
                    ))}
                </ol>
            </div>

            {/* Main Table Box */}
            <div className="section-box table-box">
                <div className="table-header">
                    <span>Business</span>
                    <span>Status</span>
                    <span>Certified On</span>
                    <span>Expiry</span>
                    <span>Current Reviews</span>
                </div>
                <div className="table-body">
                    {certifiedBusinesses.map((b, i) => (
                        <div className="table-row" key={i}>
                            <span className="fw-bold">{b.name}</span>
                            <span className={`status-pill ${b.status === "Expiring Soon" ? "warning" : "success"}`}>{b.status}</span>
                            <span>{b.certifiedOn}</span>
                            <span>{b.expiry}</span>
                            <span>⭐ {b.reviews}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="action-row">
                <button className="action-card">Add Business</button>
                <button className="action-card">Remove Business</button>
                <button className="action-card">Renew Certifications</button>
            </div>

            <style>{`
        .certificate-container { font-family: 'Inter', sans-serif; max-width: 900px; }
        
        .section-box {
          border: 2px solid #000;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 24px;
          background: #fff;
        }

        .top-list h3 { margin-top: 0; }
        .top-list ol { margin-bottom: 0; padding-left: 20px; font-weight: 500; }

        .table-box { padding: 0; overflow: hidden; }
        .table-header {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1.5fr 1.5fr 1.5fr;
          padding: 16px 24px;
          background: #edf2f7;
          border-bottom: 2px solid #000;
          font-weight: 700;
          font-size: 14px;
          text-transform: uppercase;
        }
        .table-row {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1.5fr 1.5fr 1.5fr;
          padding: 16px 24px;
          border-bottom: 1px solid #e2e8f0;
          align-items: center;
          font-size: 14px;
        }
        .table-row:last-child { border-bottom: none; }
        .fw-bold { font-weight: 700; }
        .status-pill { 
            display: inline-block; padding: 4px 10px; border-radius: 12px; 
            font-size: 12px; font-weight: 700;
        }
        .status-pill.success { background: #c6f6d5; color: #276749; }
        .status-pill.warning { background: #feebc8; color: #9c4221; }

        .action-row { display: flex; gap: 24px; }
        .action-card {
          flex: 1;
          padding: 24px;
          border: 2px solid #000;
          border-radius: 16px;
          background: #fff;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: transform 0.1s;
        }
        .action-card:hover { background: #f7fafc; }
        .action-card:active { transform: scale(0.98); }
      `}</style>
        </div>
    );
};

export default CertificateManagement;
