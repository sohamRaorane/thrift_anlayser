import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    BadgeCheck,
    Store,
    MessageSquare,
    BarChart3,
    FileText,
    CreditCard,
    LogOut
} from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-logo">
                    <Store size={24} />
                    <span>FAD Admin</span>
                </div>

                <nav>
                    <div className="nav-section">
                        <div className="nav-section-title">Overview</div>
                        <NavLink to="/admin" end>
                            <LayoutDashboard size={18} />
                            Dashboard
                        </NavLink>
                        <NavLink to="/admin/verification">
                            <BadgeCheck size={18} />
                            Vendor Verification
                        </NavLink>
                        <NavLink to="/admin/marketplace">
                            <Store size={18} />
                            Marketplace Listings
                        </NavLink>
                        <NavLink to="/admin/reviews">
                            <FileText size={18} />
                            Review Moderation
                        </NavLink>
                    </div>

                    <div className="nav-section">
                        <div className="nav-section-title">Management</div>
                        <NavLink to="/admin/certificates">
                            <BadgeCheck size={18} />
                            Certificates
                        </NavLink>
                        <NavLink to="/admin/analytics">
                            <BarChart3 size={18} />
                            Seller Analytics
                        </NavLink>
                        <NavLink to="/admin/complaints">
                            <MessageSquare size={18} />
                            Complaints
                        </NavLink>
                        <NavLink to="/admin/subscriptions">
                            <CreditCard size={18} />
                            Subscriptions
                        </NavLink>
                    </div>
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            width: '100%',
                            padding: '12px',
                            border: 'none',
                            background: 'transparent',
                            color: '#4b5563',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                            e.currentTarget.style.color = '#111827';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#4b5563';
                        }}
                    >
                        <LogOut size={18} />
                        <span>Back to Home</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="admin-content-area">
                <header className="admin-header">
                    <div className="admin-header-left">
                        Admin Portal
                    </div>
                    <div className="admin-header-right">
                        {/* User profile or other header items can go here */}
                        <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Administrator</span>
                    </div>
                </header>

                <main className="admin-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
