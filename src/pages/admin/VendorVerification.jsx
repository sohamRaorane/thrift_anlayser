import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, FileText, ChevronRight, Download, Filter, Eye } from 'lucide-react';
import { vendorVerificationService } from '../../services/vendorVerificationService';
import './AdminLayout.css';

const VendorVerification = () => {
    const [vendors, setVendors] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [filterStatus, setFilterStatus] = useState('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [adminNote, setAdminNote] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(null); // 'approve' or 'reject'
    const [loading, setLoading] = useState(true);

    const fetchVendors = async () => {
        setLoading(true);
        try {
            const data = await vendorVerificationService.getVerifications(filterStatus);
            // Map DB fields to UI
            const formatted = data.map(v => ({
                id: v.id,
                business_name: v.business_name || v.store_name || 'Unknown Vendor',
                handle: v.instagram_handle || v.id.slice(0, 8),
                submitted: v.verification_submitted_at ? new Date(v.verification_submitted_at).toLocaleDateString() : 'N/A',
                status: v.verification_status === 'verified' ? 'approved' : v.verification_status, // Map DB 'verified' to UI 'approved'
                email: v.email || 'N/A',
                phone: v.phone_number || 'N/A',
                docs: v.verification_docs || [],
                img: (v.verification_docs && v.verification_docs.length > 0) ? v.verification_docs[0].url : 'https://placehold.co/400x300?text=No+Preview',
                notes: ''
            }));
            setVendors(formatted);

            // Should selection reset? Maybe keep if exists in new list
            if (formatted.length > 0 && !selectedId) {
                setSelectedId(formatted[0].id);
            }
        } catch (error) {
            console.error("Failed to load vendors", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, [filterStatus]);

    const selectedVendor = vendors.find(v => v.id === selectedId) || vendors[0];

    // Client-side Filters (Search)
    const filteredVendors = vendors.filter(v => {
        const matchSearch = v.business_name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchSearch;
    });

    const handleAction = async (type) => {
        if (!selectedVendor) return;

        try {
            if (type === 'approve') {
                await vendorVerificationService.approveVendor(selectedVendor.id, selectedVendor.business_name);
            } else {
                await vendorVerificationService.rejectVendor(selectedVendor.id, selectedVendor.business_name, adminNote || 'Rejected by Admin');
            }
            setShowConfirmModal(null);
            setAdminNote('');
            fetchVendors(); // Refresh list
        } catch (error) {
            console.error("Action failed:", error);
            alert("Failed to update status");
        }
    };

    const handleViewDoc = (url) => {
        if (url) window.open(url, '_blank');
        else alert("Document URL is missing");
    };

    return (
        <div className="verification-page">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Vendor Verification</h1>
            </div>

            <div className="verification-layout">
                {/* LEFT PANEL: LIST */}
                <div className="admin-card list-panel">
                    <div className="panel-controls">
                        <div className="search-box">
                            <Search size={16} color="#9ca3af" />
                            <input
                                type="text"
                                placeholder="Search vendors..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-chips">
                            {['pending', 'approved', 'rejected', 'all'].map(status => (
                                <button
                                    key={status}
                                    className={`chip ${filterStatus === status ? 'active' : ''}`}
                                    onClick={() => setFilterStatus(status)}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="vendor-list">
                        {loading ? (
                            <div className="empty-list">Loading vendors...</div>
                        ) : filteredVendors.length === 0 ? (
                            <div className="empty-list">No vendors found.</div>
                        ) : (
                            filteredVendors.map(v => (
                                <div
                                    key={v.id}
                                    className={`vendor-item ${selectedId === v.id ? 'active' : ''}`}
                                    onClick={() => setSelectedId(v.id)}
                                >
                                    <div className="v-avatar">{v.business_name[0]}</div>
                                    <div className="v-info">
                                        <div className="v-name">{v.business_name}</div>
                                        <div className="v-meta">{v.submitted}</div>
                                    </div>
                                    <div className={`status-dot ${v.status}`}></div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL: DETAILS */}
                <div className="admin-card detail-panel">
                    {selectedVendor ? (
                        <>
                            <div className="detail-header">
                                <div className="dh-info">
                                    <h2>{selectedVendor.business_name}</h2>
                                    <span className="handle">{selectedVendor.handle}</span>
                                </div>
                                <div className={`badge-pill badge-${selectedVendor.status === 'pending' ? 'warning' : selectedVendor.status === 'approved' ? 'active' : 'error'}`}>
                                    {selectedVendor.status}
                                </div>
                            </div>

                            <div className="detail-grid">
                                <div className="detail-section">
                                    <h3>Contact Info</h3>
                                    <div className="info-row">
                                        <label>Email</label>
                                        <span>{selectedVendor.email}</span>
                                    </div>
                                    <div className="info-row">
                                        <label>Phone</label>
                                        <span>{selectedVendor.phone}</span>
                                    </div>
                                    <div className="info-row">
                                        <label>Submitted</label>
                                        <span>{selectedVendor.submitted}</span>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h3>Documents</h3>
                                    <div className="docs-list">
                                        {selectedVendor.docs.map((doc, i) => (
                                            <div key={i} className="doc-item">
                                                <FileText size={20} color="#4b5563" />
                                                <div className="doc-name">{doc.name}</div>
                                                <span className="doc-type">{doc.type}</span>
                                                <button className="btn-preview" onClick={() => handleViewDoc(doc.url)}><Eye size={14} /></button>
                                            </div>
                                        ))}
                                        {selectedVendor.docs.length === 0 && <div className="no-docs">No documents attached.</div>}
                                    </div>
                                </div>
                            </div>

                            <div className="notes-section">
                                <label>Admin Notes</label>
                                <textarea
                                    placeholder="Add notes about this verification..."
                                    value={adminNote || selectedVendor.notes}
                                    onChange={e => setAdminNote(e.target.value)}
                                    disabled={selectedVendor.status !== 'pending'}
                                />
                            </div>

                            {selectedVendor.status === 'pending' && (
                                <div className="detail-actions">
                                    <button className="btn-reject" onClick={() => setShowConfirmModal('reject')}>Reject Vendor</button>
                                    <button className="btn-approve" onClick={() => setShowConfirmModal('approve')}>Approve & Verify</button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="empty-detail">Select a vendor to view details</div>
                    )}
                </div>
            </div>

            {/* CONFIRMATION MODAL */}
            {showConfirmModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirm {showConfirmModal === 'approve' ? 'Approval' : 'Rejection'}</h3>
                        <p>Are you sure you want to {showConfirmModal} <b>{selectedVendor?.business_name}</b>?</p>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setShowConfirmModal(null)}>Cancel</button>
                            <button
                                className={`btn-primary ${showConfirmModal === 'approve' ? 'approve-bg' : 'reject-bg'}`}
                                onClick={() => handleAction(showConfirmModal)}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .verification-layout {
                    display: grid;
                    grid-template-columns: 320px 1fr;
                    gap: 1.5rem;
                    height: calc(100vh - 180px);
                }
                .list-panel { padding: 0; display: flex; flex-direction: column; overflow: hidden; }
                .panel-controls { padding: 1rem; border-bottom: 1px solid #e5e7eb; }
                
                .search-box {
                    display: flex; align-items: center; gap: 8px;
                    background: #f9fafb; border: 1px solid #e5e7eb;
                    padding: 8px 12px; border-radius: 8px; margin-bottom: 1rem;
                }
                .search-box input { border: none; background: transparent; outline: none; font-size: 0.9rem; width: 100%; }

                .filter-chips { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; }
                .chip {
                    padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 500;
                    border: 1px solid #e5e7eb; background: white; cursor: pointer; color: #6b7280; white-space: nowrap;
                }
                .chip.active { background: #111827; color: white; border-color: #111827; }

                .vendor-list { flex: 1; overflow-y: auto; }
                .vendor-item {
                    display: flex; align-items: center; gap: 12px; padding: 1rem;
                    border-bottom: 1px solid #f3f4f6; cursor: pointer; transition: background 0.2s;
                }
                .vendor-item:hover { background: #f9fafb; }
                .vendor-item.active { background: #eff6ff; border-right: 3px solid #3b82f6; }
                
                .v-avatar { width: 36px; height: 36px; background: #e0e7ff; color: #4f46e5; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }
                .v-info { flex: 1; }
                .v-name { font-size: 0.9rem; font-weight: 600; color: #1f2937; }
                .v-meta { font-size: 0.75rem; color: #9ca3af; }
                .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #d1d5db; }
                .status-dot.pending { background: #f59e0b; }
                .status-dot.approved { background: #10b981; }
                .status-dot.rejected { background: #ef4444; }

                .detail-panel { padding: 2rem; overflow-y: auto; display: flex; flex-direction: column; }
                .detail-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 1.5rem; }
                .dh-info h2 { margin: 0; font-size: 1.5rem; color: #111827; }
                .handle { color: #6b7280; font-size: 0.9rem; }

                .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; }
                .detail-section h3 { font-size: 0.9rem; font-weight: 600; color: #374151; margin-bottom: 1rem; text-transform: uppercase; }
                
                .info-row { display: flex; flex-direction: column; margin-bottom: 1rem; }
                .info-row label { font-size: 0.75rem; color: #9ca3af; margin-bottom: 2px; }
                .info-row span { font-size: 0.95rem; color: #111827; font-weight: 500; }

                .docs-list { display: flex; flex-direction: column; gap: 0.75rem; }
                .doc-item {
                    display: flex; align-items: center; gap: 10px; padding: 10px;
                    border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb;
                }
                .doc-name { flex: 1; font-size: 0.85rem; font-weight: 500; }
                .doc-type { font-size: 0.75rem; background: #e5e7eb; padding: 2px 6px; border-radius: 4px; color: #4b5563; }
                .btn-preview { background: none; border: none; cursor: pointer; padding: 4px; color: #6b7280; }
                .btn-preview:hover { color: #111827; }

                .notes-section { margin-top: auto; margin-bottom: 1.5rem; }
                .notes-section label { display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem; }
                .notes-section textarea {
                    width: 100%; min-height: 100px; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px;
                    font-family: inherit; resize: vertical; outline: none;
                }

                .detail-actions { display: flex; gap: 1rem; justify-content: flex-end; border-top: 1px solid #e5e7eb; padding-top: 1.5rem; }
                .btn-approve, .btn-reject {
                    padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s;
                }
                .btn-approve { background: #10b981; color: white; }
                .btn-approve:hover { background: #059669; }
                .btn-reject { background: white; border: 1px solid #ef4444; color: #ef4444; }
                .btn-reject:hover { background: #fef2f2; }

                /* Modal */
                .modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.5); z-index: 100; display: flex; align-items: center; justify-content: center;
                }
                .modal-content {
                    background: white; padding: 2rem; border-radius: 12px; width: 400px; max-width: 90%;
                    text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                }
                .modal-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem; }
                .btn-secondary { background: #f3f4f6; color: #374151; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
                .btn-primary { color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
                .approve-bg { background: #10b981; }
                .reject-bg { background: #ef4444; }
            `}</style>
        </div>
    );
};

export default VendorVerification;
