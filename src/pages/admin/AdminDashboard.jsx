import React from 'react';
import { ShieldAlert, FileText, MessageSquareWarning } from 'lucide-react';
import '../../components/layouts/Admin.css';

const AdminDashboard = () => {
    return (
        <div>
            <h2 className="page-title">Dashboard</h2>

            <div className="dashboard-grid">
                {/* Verification Tile */}
                <div className="admin-card stats-card">
                    <div className="stats-icon verify-bg">
                        <ShieldAlert size={32} color="#dd6b20" />
                    </div>
                    <div className="stats-info">
                        <h3>Pending Vendor Verification</h3>
                        <span className="stats-number">12</span>
                        <p className="stats-sub">Requires immediate attention</p>
                    </div>
                </div>

                {/* Listings Tile */}
                <div className="admin-card stats-card">
                    <div className="stats-icon listing-bg">
                        <FileText size={32} color="#3182ce" />
                    </div>
                    <div className="stats-info">
                        <h3>Listings Awaiting Review</h3>
                        <span className="stats-number">45</span>
                        <p className="stats-sub">New items today</p>
                    </div>
                </div>

                {/* Reviews Tile */}
                <div className="admin-card stats-card">
                    <div className="stats-icon review-bg">
                        <MessageSquareWarning size={32} color="#e53e3e" />
                    </div>
                    <div className="stats-info">
                        <h3>Reviews Flagged</h3>
                        <span className="stats-number">8</span>
                        <p className="stats-sub">Community reports</p>
                    </div>
                </div>
            </div>

            {/* Additional styling for dashboard specific elements */}
            <style>{`
        .stats-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 30px;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .stats-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .stats-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .verify-bg { background-color: #ffebd8; }
        .listing-bg { background-color: #bee3f8; }
        .review-bg { background-color: #fed7d7; }

        .stats-info h3 {
          margin: 0 0 8px 0;
          font-size: 16px;
          color: #718096;
          font-weight: 600;
        }
        .stats-number {
          font-size: 36px;
          font-weight: 800;
          color: #2d3748;
          line-height: 1;
        }
        .stats-sub {
          margin: 4px 0 0 0;
          font-size: 13px;
          color: #a0aec0;
        }
      `}</style>
        </div>
    );
};

export default AdminDashboard;
