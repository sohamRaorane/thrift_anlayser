import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShieldCheck, Store, Flag } from 'lucide-react';
import './Admin.css';

const AdminLayout = () => {
    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h2>LOGO</h2>
                    <span className="admin-badge">ADMIN</span>
                </div>

                <nav className="admin-nav">
                    <div className="nav-section-title">DASHBOARD</div>

                    <NavLink to="/admin" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink to="/admin/verification" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <ShieldCheck size={20} />
                        <span>Vendor Verification</span>
                    </NavLink>

                    <NavLink to="/admin/listings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Store size={20} />
                        <span>Marketplace Listings</span>
                    </NavLink>

                    <NavLink to="/admin/reviews" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Flag size={20} />
                        <span>Review Moderation</span>
                    </NavLink>

                    <div className="nav-section-title" style={{ marginTop: '20px' }}>MANAGEMENT</div>

                    <NavLink to="/admin/certificates" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span>📜 Certificates</span>
                    </NavLink>

                    <NavLink to="/admin/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span>📊 Seller Analytics</span>
                    </NavLink>

                    <NavLink to="/admin/complaints" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span>🎫 Complaints</span>
                    </NavLink>

                    <NavLink to="/admin/subscriptions" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span>💎 Subscriptions</span>
                    </NavLink>
                </nav>
            </aside>

            <main className="admin-content">
                <div className="admin-header">
                    <h1>Admin Portal</h1>
                </div>
                <div className="admin-page-wrapper">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
