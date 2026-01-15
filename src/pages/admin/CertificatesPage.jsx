import React, { useState, useEffect } from 'react';
import { Search, Filter, RotateCcw, Ban, Star, Loader2 } from 'lucide-react';
import { certificatesService } from '../../services/certificatesService';
import './AdminLayout.css';

const CertificatesPage = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [processingId, setProcessingId] = useState(null); // Track ID being acted on

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await certificatesService.getCertificates();
            setCertificates(data);
        } catch (error) {
            console.error("Failed to load certificates", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRenew = async (id) => {
        setProcessingId(id);
        try {
            const updated = await certificatesService.renewCertificate(id);
            // Merge updated fields into existing state
            setCertificates(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
            alert("Certificate renewed successfully.");
        } catch (error) {
            alert("Failed to renew certificate.");
        } finally {
            setProcessingId(null);
        }
    };

    const handleRevoke = async (id) => {
        if (!window.confirm("Are you sure you want to revoke this certificate? This action cannot be undone easily.")) return;

        setProcessingId(id);
        try {
            const updated = await certificatesService.revokeCertificate(id);
            // Merge updated fields
            setCertificates(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
        } catch (error) {
            alert("Failed to revoke certificate.");
        } finally {
            setProcessingId(null);
        }
    };

    // Filter & Search Logic
    const filteredData = certificates.filter(cert => {
        const matchesSearch = cert.business.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || cert.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Sort: Active issues (Expired/Expiring) to top, then Active, then others
    const sortedData = [...filteredData].sort((a, b) => {
        const priority = { 'Expired': 0, 'Expiring Soon': 1, 'Review Due': 2, 'Active': 3, 'Verified': 3, 'Not Certified': 4, 'Revoked': 5 };
        return (priority[a.status] || 99) - (priority[b.status] || 99);
    });

    if (loading) return <div className="admin-main" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Loading certificates data...</div>;

    return (
        <div className="certificates-page">
            <div className="admin-page-header">
                <h1 className="admin-page-title">FAD Certificate Management</h1>
            </div>

            <div className="admin-card">
                {/* Toolbar */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input
                            type="text"
                            placeholder="Search business name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 10px 10px 38px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                outline: 'none',
                                fontSize: '0.95rem'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Filter size={18} color="#6b7280" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '0.9rem' }}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Active">Active / Verified</option>
                            <option value="Expiring Soon">Expiring Soon</option>
                            <option value="Expired">Expired</option>
                            <option value="Revoked">Revoked</option>
                            <option value="Not Certified">Not Certified</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#f9fafb' }}>
                            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <th style={{ padding: '14px 16px', fontWeight: '600', color: '#374151', fontSize: '0.85rem', textTransform: 'uppercase' }}>Business</th>
                                <th style={{ padding: '14px 16px', fontWeight: '600', color: '#374151', fontSize: '0.85rem', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '14px 16px', fontWeight: '600', color: '#374151', fontSize: '0.85rem', textTransform: 'uppercase' }}>Certified On</th>
                                <th style={{ padding: '14px 16px', fontWeight: '600', color: '#374151', fontSize: '0.85rem', textTransform: 'uppercase' }}>Expiry</th>
                                <th style={{ padding: '14px 16px', fontWeight: '600', color: '#374151', fontSize: '0.85rem', textTransform: 'uppercase' }}>Reviews</th>
                                <th style={{ padding: '14px 16px', fontWeight: '600', color: '#374151', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData.map(cert => (
                                <tr key={cert.id} style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: 'white' }}>
                                    <td style={{ padding: '16px', fontWeight: '600', color: '#111827' }}>
                                        {cert.business}
                                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '400' }}>ID: {cert.id.substring(0, 6)}...</div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span className={`badge-pill ${cert.status === 'Active' || cert.status === 'Verified' ? 'badge-active' :
                                                cert.status === 'Expiring Soon' || cert.status === 'Review Due' ? 'badge-warning' :
                                                    cert.status === 'Not Certified' ? 'badge-neutral' :
                                                        'badge-error'
                                            }`}>
                                            {cert.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', color: '#6b7280', fontSize: '0.9rem' }}>{cert.certifiedOn}</td>
                                    <td style={{ padding: '16px', color: '#6b7280', fontSize: '0.9rem' }}>{cert.expiry}</td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Star size={14} fill="#fbbf24" stroke="none" />
                                            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{cert.rating || '—'}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                            <button
                                                onClick={() => handleRenew(cert.id)}
                                                title={cert.status === 'Not Certified' ? "Create Certificate" : "Renew Certificate"}
                                                disabled={cert.status === 'Revoked' || processingId === cert.id}
                                                style={{
                                                    padding: '8px',
                                                    borderRadius: '6px',
                                                    border: '1px solid #d1d5db',
                                                    background: 'white',
                                                    cursor: (cert.status === 'Revoked' || processingId) ? 'not-allowed' : 'pointer',
                                                    opacity: (cert.status === 'Revoked' || processingId === cert.id) ? 0.5 : 1,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}
                                            >
                                                {processingId === cert.id ? <Loader2 size={16} className="spin" /> : <RotateCcw size={16} color="#059669" />}
                                            </button>

                                            {cert.status !== 'Not Certified' && (
                                                <button
                                                    onClick={() => handleRevoke(cert.id)}
                                                    title="Revoke Certificate"
                                                    disabled={cert.status === 'Revoked' || processingId === cert.id}
                                                    style={{
                                                        padding: '8px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #d1d5db',
                                                        background: 'white',
                                                        cursor: (cert.status === 'Revoked' || processingId) ? 'not-allowed' : 'pointer',
                                                        opacity: (cert.status === 'Revoked' || processingId === cert.id) ? 0.5 : 1,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}
                                                >
                                                    <Ban size={16} color="#dc2626" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {sortedData.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                                        No vendors found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                .badge-neutral { background-color: #f3f4f6; color: #6b7280; border: 1px solid #e5e7eb; }
            `}</style>
        </div>
    );
};

export default CertificatesPage;
