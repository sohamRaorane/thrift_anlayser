import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
    LineChart, Line, Area, AreaChart
} from 'recharts';
import './AdminLayout.css';

// Reusable Progress Bar
const SimpleProgressBar = ({ label, percentage }) => (
    <div style={{ marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#4b5563', letterSpacing: '0.02em' }}>{label}</span>
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#111827' }}>{percentage}%</span>
        </div>
        <div style={{ width: '100%', height: '6px', backgroundColor: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
            <div
                style={{
                    width: `${percentage}%`,
                    height: '100%',
                    backgroundColor: '#111827',
                    borderRadius: '3px',
                    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            />
        </div>
    </div>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                padding: '8px 12px',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '0.85rem'
            }}>
                <p style={{ fontWeight: '600', color: '#111827', margin: 0 }}>{label}</p>
                <p style={{ color: '#4b5563', margin: '4px 0 0' }}>
                    {payload[0].name}: <span style={{ fontWeight: '600', color: '#111827' }}>{payload[0].value}</span>
                </p>
            </div>
        );
    }
    return null;
};

const SellerAnalyticsPage = () => {
    const [sellers, setSellers] = useState([]);
    const [selectedSeller, setSelectedSeller] = useState('');
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        const init = async () => {
            const sellersList = await analyticsService.getSellers();
            setSellers(sellersList);
            if (sellersList.length > 0) {
                setSelectedSeller(sellersList[0].id);
            }
            setPageLoading(false);
        };
        init();
    }, []);

    // Fetch Analytics on Seller Change
    useEffect(() => {
        if (selectedSeller) {
            fetchAnalytics(selectedSeller);
        }
    }, [selectedSeller]);

    const fetchAnalytics = async (id) => {
        setLoading(true);
        const data = await analyticsService.getSellerAnalytics(id);
        setAnalytics(data);
        setLoading(false);
    };

    if (pageLoading) return <div className="admin-main">Loading sellers...</div>;

    const COLORS = ['#111827', '#6b7280', '#e5e7eb', '#f3f4f6'];

    return (
        <div className="analytics-page">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Seller Analytics</h1>
            </div>

            {/* Seller Selector */}
            <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Select Business Account
                </label>
                <select
                    value={selectedSeller}
                    onChange={(e) => setSelectedSeller(e.target.value)}
                    style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        minWidth: '320px',
                        fontSize: '0.95rem',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        color: '#111827',
                        fontWeight: '500',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        outline: 'none'
                    }}
                >
                    {sellers.length === 0 && <option>No sellers found</option>}
                    {sellers.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
            </div>

            {(loading || !analytics) ? (
                <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontWeight: '500' }}>
                    Loading analytics data...
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Top Row: Mini Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        {/* 1. Verification */}
                        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
                            <div style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Verification Status</div>
                            {analytics.verification.status === 'Verified' ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CheckCircle size={20} color="#059669" />
                                    <span className="badge-pill badge-active" style={{ fontSize: '0.85rem' }}>Verified Account</span>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <AlertCircle size={20} color="#dc2626" />
                                    <span className="badge-pill badge-error" style={{ fontSize: '0.85rem' }}>Unverified</span>
                                </div>
                            )}
                        </div>

                        {/* 2. Renewal */}
                        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
                            <div style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Renewal Status</div>
                            {analytics.renewal.status === 'Review Due' || analytics.renewal.status === 'Expiring Soon' ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Clock size={20} color="#d97706" />
                                    <span className="badge-pill badge-warning" style={{ fontSize: '0.85rem' }}>Review Due</span>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CheckCircle size={20} color="#059669" />
                                    <span className="badge-pill badge-active" style={{ fontSize: '0.85rem' }}>Active</span>
                                </div>
                            )}
                        </div>

                        {/* 3. Active Complaints */}
                        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'center' }}>
                            <div style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Active Complaints</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#111827', lineHeight: 1 }}>
                                {analytics.activeComplaints}
                            </div>
                        </div>
                    </div>

                    {/* Middle Row: Charts */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '1.5rem' }}>

                        {/* Delivery Trends */}
                        <div className="admin-card" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>Delivery Time Trends (Last 4 Weeks)</h3>
                            <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={analytics.deliveryTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#9ca3af', fontSize: 11 }}
                                        />
                                        <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                                        <Bar dataKey="days" radius={[6, 6, 0, 0]} barSize={40} fill="#374151" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: '#9ca3af', fontStyle: 'italic' }}>
                                Average delivery days per week
                            </div>
                        </div>

                        {/* Complaint Types */}
                        <div className="admin-card" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', width: '100%', textAlign: 'left', color: '#111827' }}>Complaint Types</h3>
                            <div style={{ flex: 1, width: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={analytics.complaintTypes}
                                            innerRadius={65}
                                            outerRadius={85}
                                            paddingAngle={4}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {analytics.complaintTypes.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                                    <div style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Total</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827' }}>
                                        {analytics.complaintTypes.reduce((acc, curr) => acc + curr.value, 0)}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '20px', marginTop: '1rem', fontSize: '0.85rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {analytics.complaintTypes.map((entry, index) => (
                                    <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: 10, height: 10, background: COLORS[index % COLORS.length], borderRadius: '50%' }}></div>
                                        <span style={{ color: '#4b5563', fontWeight: '500' }}>{entry.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Score & Progress */}
                    <div className="admin-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'flex-end' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#111827' }}>Review DripScore History</h3>
                                <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '6px' }}>
                                    Last Month: <strong style={{ color: '#111827' }}>4.2</strong>
                                    <span style={{ margin: '0 12px', color: '#e5e7eb' }}>|</span>
                                    Current: <strong style={{ color: '#111827' }}>4.5</strong>
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#111827' }}>Performance Metrics</h3>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '4rem' }}>
                            {/* DripScore Line Chart */}
                            <div style={{ height: '180px', marginTop: '-10px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={analytics.dripScoreHistory} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#111827" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#111827" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} dy={10} />
                                        <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="score"
                                            stroke="#111827"
                                            strokeWidth={2.5}
                                            fillOpacity={1}
                                            fill="url(#colorScore)"
                                            activeDot={{ r: 6, strokeWidth: 0, fill: '#111827' }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Metrics Bars */}
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <SimpleProgressBar label="Customer Satisfaction" percentage={analytics.performance.satisfaction} />
                                <SimpleProgressBar label="Response to Complaints" percentage={analytics.performance.responseRate} />
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default SellerAnalyticsPage;
