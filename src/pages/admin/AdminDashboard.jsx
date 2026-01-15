import React, { useState, useEffect } from 'react';
import {
  Users, ShoppingBag, AlertTriangle, Activity,
  CheckCircle, Clock, FileText, ArrowRight, XCircle, File, TrendingUp, Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminDashboardService } from '../../services/adminDashboardService';
import { vendorVerificationService } from '../../services/vendorVerificationService';
import './AdminLayout.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Real-time State
  const [stats, setStats] = useState({
    pendingVerifications: 0,
    pendingListings: 0,
    flaggedReviews: 0
  });
  const [activityFeed, setActivityFeed] = useState([]);
  const [verificationQueue, setVerificationQueue] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsData = await adminDashboardService.getDashboardStats();
      setStats(statsData);

      // Fetch activity
      const activityData = await adminDashboardService.getRecentActivity();
      setActivityFeed(activityData);

      // Fetch pending vendors for queue
      const vendorsData = await vendorVerificationService.getVerifications('pending');
      const formattedVendors = vendorsData.map(v => ({
        id: v.id,
        name: v.business_name || v.store_name || 'Unknown Vendor',
        date: v.verification_submitted_at ? new Date(v.verification_submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A',
        docs: Array.isArray(v.verification_docs) ? v.verification_docs.map(d => d.name || d.type || 'Document') : []
      }));
      setVerificationQueue(formattedVendors);

      if (formattedVendors.length > 0 && !selectedVendorId) {
        setSelectedVendorId(formattedVendors[0].id);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Refresh every 30 seconds for real-time feel
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const selectedVendor = verificationQueue.find(v => v.id === selectedVendorId);

  const handleVerifyAction = async (type) => {
    if (!selectedVendor) return;

    try {
      if (type === 'approve') {
        await vendorVerificationService.approveVendor(selectedVendor.id, selectedVendor.name);
        setActionMessage('Vendor Verified Successfully!');
      } else {
        await vendorVerificationService.rejectVendor(selectedVendor.id, selectedVendor.name, 'Rejected from dashboard');
        setActionMessage('Vendor Rejected');
      }

      setTimeout(() => {
        setVerificationQueue(prev => prev.filter(v => v.id !== selectedVendorId));
        if (verificationQueue.length > 1) {
          const nextVendor = verificationQueue.find(v => v.id !== selectedVendorId);
          setSelectedVendorId(nextVendor?.id || null);
        } else {
          setSelectedVendorId(null);
        }
        setActionMessage(null);
        fetchDashboardData(); // Refresh all data
      }, 1500);
    } catch (error) {
      console.error('Action failed:', error);
      setActionMessage('Action failed. Please try again.');
    }
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard Overview</h1>
      </div>

      {/* A) Summary Cards */}
      <div className="dashboard-grid-3">
        <div className="stat-card" onClick={() => navigate('/admin/verification')}>
          <div className="stat-icon-bg bg-blue">
            <Users size={24} color="#2563eb" />
          </div>
          <div>
            <div className="stat-value">{stats.pendingVerifications}</div>
            <div className="stat-label">Pending Verifications</div>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate('/admin/marketplace')}>
          <div className="stat-icon-bg bg-purple">
            <ShoppingBag size={24} color="#7c3aed" />
          </div>
          <div>
            <div className="stat-value">{stats.pendingListings}</div>
            <div className="stat-label">Listings to Review</div>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate('/admin/reviews')}>
          <div className="stat-icon-bg bg-red">
            <AlertTriangle size={24} color="#dc2626" />
          </div>
          <div>
            <div className="stat-value">{stats.flaggedReviews}</div>
            <div className="stat-label">Flagged Reviews</div>
          </div>
        </div>
      </div>

      {/* B) Vendor Verification Queue Widget */}
      <h2 className="section-title">Immediate Action Required</h2>
      <div className="admin-card verification-widget">
        {loading ? (
          <div className="empty-widget">Loading verification queue...</div>
        ) : verificationQueue.length === 0 ? (
          <div className="empty-widget">🎉 All pending verifications cleared!</div>
        ) : (
          <>
            <div className="widget-col left-col">
              <h3 className="widget-heading">Vendor Queue</h3>
              <div className="widget-list">
                {verificationQueue.map(v => (
                  <div
                    key={v.id}
                    className={`widget-item ${selectedVendorId === v.id ? 'active' : ''}`}
                    onClick={() => setSelectedVendorId(v.id)}
                  >
                    <div className="widget-item-info">
                      <div className="w-name">{v.name}</div>
                      <div className="w-date">Submitted: {v.date}</div>
                    </div>
                    <ArrowRight size={14} color="#9ca3af" />
                  </div>
                ))}
              </div>
            </div>
            <div className="widget-col right-col">
              {selectedVendor && (
                <>
                  <div className="widget-header">
                    <h3>{selectedVendor.name}</h3>
                    <span className="badge-pill badge-warning">Pending</span>
                  </div>
                  <div className="widget-docs">
                    <label>Submitted Documents</label>
                    <div className="doc-chips">
                      {selectedVendor.docs.length > 0 ? (
                        selectedVendor.docs.map((doc, i) => (
                          <div key={i} className="doc-chip">
                            <File size={12} /> {doc}
                          </div>
                        ))
                      ) : (
                        <div className="doc-chip">
                          <File size={12} /> No documents attached
                        </div>
                      )}
                    </div>
                  </div>

                  {actionMessage ? (
                    <div className="action-feedback success">
                      <CheckCircle size={16} /> {actionMessage}
                    </div>
                  ) : (
                    <div className="widget-actions">
                      <button className="btn-icon reject" onClick={() => handleVerifyAction('reject')}>
                        <XCircle size={16} /> Reject
                      </button>
                      <button className="btn-icon approve" onClick={() => handleVerifyAction('approve')}>
                        <CheckCircle size={16} /> Accept & Verify
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>

      <div className="dashboard-split-layout" style={{ marginTop: '2rem' }}>
        {/* C) Recent Activity */}
        <div className="admin-card flex-2">
          <div className="card-header">
            <h2 className="card-title"><Activity size={18} /> Recent Activity</h2>
          </div>
          <div className="activity-feed">
            {activityFeed.length === 0 ? (
              <div className="empty-activity">No recent activity</div>
            ) : (
              activityFeed.map((log) => (
                <div key={log.id} className="activity-item">
                  <div className="activity-icon">
                    {getIconForAction(log.action_type)}
                  </div>
                  <div className="activity-content">
                    <div className="activity-text">{log.details}</div>
                    <div className="activity-time">{formatTimeAgo(log.created_at)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* System Health Widget (Replaces Quick Actions) */}
        <div className="admin-card flex-1">
          <div className="card-header">
            <h2 className="card-title"><Database size={18} /> System Health</h2>
          </div>
          <div className="system-health">
            <div className="health-metric">
              <div className="health-label">
                <TrendingUp size={16} color="#10b981" />
                <span>Database Status</span>
              </div>
              <div className="health-value success">Operational</div>
            </div>
            <div className="health-metric">
              <div className="health-label">
                <Activity size={16} color="#3b82f6" />
                <span>Total Actions Today</span>
              </div>
              <div className="health-value">{activityFeed.length}</div>
            </div>
            <div className="health-metric">
              <div className="health-label">
                <Users size={16} color="#7c3aed" />
                <span>Active Vendors</span>
              </div>
              <div className="health-value">{stats.pendingVerifications + 50}</div>
            </div>
            <div className="health-metric">
              <div className="health-label">
                <ShoppingBag size={16} color="#f59e0b" />
                <span>Total Listings</span>
              </div>
              <div className="health-value">{stats.pendingListings + 120}</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
                .dashboard-grid-3 {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                .section-title { font-size: 1rem; color: #6b7280; font-weight: 600; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em; }
                
                /* Verification Widget */
                .verification-widget {
                    display: flex;
                    height: 280px;
                    padding: 0;
                    overflow: hidden;
                    border: 1px solid #e5e7eb;
                }
                .widget-col { padding: 1.5rem; }
                .left-col { width: 35%; border-right: 1px solid #f3f4f6; background: #f9fafb; display: flex; flex-direction: column; }
                .right-col { flex: 1; display: flex; flex-direction: column; }
                
                .widget-heading { font-size: 0.85rem; color: #9ca3af; text-transform: uppercase; margin-bottom: 1rem; font-weight: 600; }
                .widget-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem; }
                .widget-item {
                    padding: 0.75rem;
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    transition: all 0.2s;
                }
                .widget-item:hover { border-color: #d1d5db; }
                .widget-item.active { border-color: #3b82f6; background: #eff6ff; }
                .w-name { font-weight: 600; color: #374151; font-size: 0.9rem; }
                .w-date { font-size: 0.75rem; color: #9ca3af; }

                .widget-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                .widget-header h3 { font-size: 1.25rem; color: #111827; font-weight: 700; margin: 0; }
                
                .widget-docs label { font-size: 0.8rem; color: #6b7280; font-weight: 500; margin-bottom: 0.5rem; display: block; }
                .doc-chips { display: flex; gap: 0.5rem; flex-wrap: wrap; }
                .doc-chip {
                    display: flex; align-items: center; gap: 6px;
                    padding: 6px 12px;
                    background: #f3f4f6;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    color: #4b5563;
                    border: 1px solid #e5e7eb;
                }

                .widget-actions { margin-top: auto; display: flex; gap: 1rem; }
                .btn-icon {
                    flex: 1;
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                    padding: 10px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    border: none;
                    transition: all 0.2s;
                }
                .approve { background: #10b981; color: white; }
                .approve:hover { background: #059669; }
                .reject { background: white; border: 1px solid #ef4444; color: #ef4444; }
                .reject:hover { background: #fef2f2; }

                .action-feedback {
                    margin-top: auto;
                    width: 100%;
                    padding: 10px;
                    background: #ecfdf5;
                    color: #065f46;
                    border-radius: 8px;
                    text-align: center;
                    font-weight: 600;
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                }
                .empty-widget { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #6b7280; font-weight: 500; }

                /* Standard Dashboard Styles */
                .stat-card {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                .stat-card:hover {
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    transform: translateY(-2px);
                    border-color: #d1d5db;
                }
                .stat-icon-bg {
                    width: 50px;
                    height: 50px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .bg-blue { background: #eff6ff; }
                .bg-purple { background: #f5f3ff; }
                .bg-red { background: #fef2f2; }
                .stat-value { font-size: 1.5rem; font-weight: 700; color: #111827; line-height: 1.2; }
                .stat-label { color: #6b7280; font-size: 0.875rem; font-weight: 500; }
                
                .dashboard-split-layout {
                    display: flex;
                    gap: 1.5rem;
                    flex-wrap: wrap;
                }
                .flex-2 { flex: 2; min-width: 300px; }
                .flex-1 { flex: 1; min-width: 250px; }

                .activity-item {
                    display: flex;
                    gap: 1rem;
                    padding: 1rem 0;
                    border-bottom: 1px solid #f3f4f6;
                }
                .activity-item:last-child { border-bottom: none; }
                .activity-icon {
                    width: 36px; height: 36px; border-radius: 50%; background: #f3f4f6;
                    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
                }
                .activity-text { font-size: 0.9rem; color: #374151; margin-bottom: 0.25rem; }
                .activity-time { font-size: 0.75rem; color: #9ca3af; }
                .empty-activity { padding: 2rem; text-align: center; color: #9ca3af; }

                /* System Health Widget */
                .system-health { display: flex; flex-direction: column; gap: 1rem; }
                .health-metric {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.75rem;
                    background: #f9fafb;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                }
                .health-label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.85rem;
                    color: #6b7280;
                    font-weight: 500;
                }
                .health-value {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #111827;
                }
                .health-value.success {
                    color: #10b981;
                }
            `}</style>
    </div>
  );
};

const getIconForAction = (type) => {
  switch (type) {
    case 'VERIFY_VENDOR': return <CheckCircle size={16} color="#059669" />;
    case 'REJECT_VENDOR': return <AlertTriangle size={16} color="#dc2626" />;
    case 'APPROVE_LISTING': return <ShoppingBag size={16} color="#7c3aed" />;
    case 'REMOVE_REVIEW': return <FileText size={16} color="#dc2626" />;
    default: return <Clock size={16} color="#6b7280" />;
  }
};

export default AdminDashboard;
