import React, { useState } from 'react';
import { FileText, Shield, AlertTriangle, CheckCircle, XCircle, History, User } from 'lucide-react';

const VendorVerification = () => {
    // Mock Data
    const [vendors, setVendors] = useState([
        {
            id: 1, name: "Retro Threads Studio", status: "pending", location: "Mumbai", dripScore: 85,
            documents: {
                screenshots: ["Store_Front.jpg", "Inventory_Grid.jpg"],
                invoices: ["Vendor_Invoice_001.pdf"],
                business: ["GST_Reg.pdf"],
                govId: ["Aadhar_Card.pdf"]
            }
        },
        {
            id: 2, name: "Urban Vintage Co.", status: "pending", location: "Delhi", dripScore: 72,
            documents: { screenshots: [], invoices: [], business: [], govId: [] }
        }
    ]);
    const [selectedVendor, setSelectedVendor] = useState(vendors[0]);
    const [adminNote, setAdminNote] = useState("");

    const handleAction = (action) => {
        alert(`${action} action triggered for ${selectedVendor?.name}`);
    };

    return (
        <div className="manual-review-container">
            <h2 className="page-title"> // ADMIN {'{Manual Review}'}</h2>

            <div className="review-layout">
                {/* LEFT PANEL: EVIDENCE UPLOAD */}
                <div className="evidence-panel admin-card">
                    <h3 className="panel-title">Evidence Upload Panel</h3>

                    <div className="evidence-list">
                        <div className="evidence-category">
                            <label>Screenshots</label>
                            <div className="file-pill-list">
                                {selectedVendor?.documents.screenshots.map((doc, i) => (
                                    <div key={i} className="file-pill">{doc}</div>
                                ))}
                                {selectedVendor?.documents.screenshots.length === 0 && <span className="empty-text">No files</span>}
                            </div>
                        </div>

                        <div className="evidence-category">
                            <label>Invoices</label>
                            <div className="file-pill-list">
                                {selectedVendor?.documents.invoices.map((doc, i) => (
                                    <div key={i} className="file-pill">{doc}</div>
                                ))}
                            </div>
                        </div>

                        <div className="evidence-category">
                            <label>Business Documents</label>
                            <div className="file-pill-list">
                                {selectedVendor?.documents.business.map((doc, i) => (
                                    <div key={i} className="file-pill">{doc}</div>
                                ))}
                            </div>
                        </div>

                        <div className="evidence-category">
                            <label>Government ID</label>
                            <div className="file-pill-list">
                                {selectedVendor?.documents.govId.map((doc, i) => (
                                    <div key={i} className="file-pill">{doc}</div>
                                ))}
                            </div>
                        </div>

                        <div className="evidence-category">
                            <label>Uploaded Files</label>
                            <div className="uploaded-box">
                                <FileText size={24} color="#a0aec0" />
                            </div>
                        </div>
                    </div>

                    <button className="history-btn">
                        <History size={16} /> View History
                    </button>
                </div>

                {/* RIGHT PANEL: ADMIN ACTIONS */}
                <div className="actions-panel admin-card">
                    <h3 className="panel-title">ADMIN ACTIONS</h3>

                    <div className="profile-section">
                        <div className="profile-photo-circle">
                            <User size={48} color="#cbd5e0" />
                        </div>
                        <div className="admin-details-box">
                            <div className="detail-row"><strong>Vendor:</strong> {selectedVendor?.name}</div>
                            <div className="detail-row"><strong>Location:</strong> {selectedVendor?.location}</div>
                            <div className="detail-row"><strong>ID:</strong> #{selectedVendor?.id}8823</div>
                        </div>
                    </div>

                    <div className="main-actions">
                        <button className="action-btn approve" onClick={() => handleAction('Approve')}>
                            Approve
                        </button>
                        <button className="action-btn reject" onClick={() => handleAction('Reject')}>
                            Reject
                        </button>
                    </div>

                    <div className="notes-section">
                        <textarea
                            className="admin-notes-area"
                            placeholder="Add notes..."
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                        />
                        <button className="flag-btn" onClick={() => handleAction('Flagged')}>
                            Flag for recheck
                        </button>
                    </div>

                    <div className="bottom-actions">
                        <button className="secondary-btn">Audit Log</button>
                        <div className="dripscore-display">
                            DripScore: <strong>{selectedVendor?.dripScore}</strong>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .manual-review-container { font-family: 'Inter', sans-serif; }
        .review-layout {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 24px;
        }

        /* Evidence Panel */
        .evidence-panel {
          padding: 24px;
          border: 2px solid #000;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .panel-title { font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px 0; }
        
        .evidence-category { margin-bottom: 16px; }
        .evidence-category label { 
          display: block; 
          border: 2px solid #000; 
          border-radius: 8px; 
          padding: 8px 12px; 
          font-weight: 600; 
          margin-bottom: 8px; 
          font-size: 14px;
          background: #fff;
        }
        .file-pill-list { display: flex; flex-wrap: wrap; gap: 8px; }
        .empty-text { font-size: 12px; color: #a0aec0; font-style: italic; }
        .file-pill {
            background: #edf2f7; border: 1px solid #cbd5e0; padding: 4px 10px; 
            border-radius: 4px; font-size: 12px;
        }
        .uploaded-box {
            border: 2px dashed #a0aec0; border-radius: 8px; height: 50px; 
            display: flex; align-items: center; justify-content: center;
        }
        .history-btn {
            margin-top: auto; border: 2px solid #000; background: #fff; 
            padding: 10px; border-radius: 8px; font-weight: 700; 
            display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer;
        }

        /* Actions Panel */
        .actions-panel {
            padding: 24px;
            border: 2px solid #000;
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            gap: 24px;
        }
        .profile-section { display: flex; gap: 20px; margin-bottom: 12px; }
        .profile-photo-circle {
            width: 80px; height: 80px; border-radius: 50%; border: 2px solid #000;
            display: flex; align-items: center; justify-content: center;
        }
        .admin-details-box {
            flex: 1; border: 2px solid #000; border-radius: 12px; padding: 12px;
            font-size: 14px; font-family: monospace;
        }
        .detail-row { margin-bottom: 4px; }

        .main-actions { display: flex; gap: 20px; }
        .action-btn {
            flex: 1; padding: 14px; border: 2px solid #000; border-radius: 12px;
            font-weight: 700; cursor: pointer; font-size: 16px;
            transition: transform 0.1s;
        }
        .action-btn.approve { background: #fff; }
        .action-btn.reject { background: #fff; }
        .action-btn:hover { background: #f7fafc; }
        .action-btn:active { transform: scale(0.98); }

        .notes-section {
            border: 2px solid #000; border-radius: 16px; padding: 16px; 
            position: relative; min-height: 120px;
        }
        .admin-notes-area {
            width: 100%; border: none; outline: none; resize: none; 
            font-family: inherit; min-height: 80px;
        }
        .flag-btn {
            position: absolute; bottom: 16px; right: 16px;
            border: 2px solid #000; background: #fff; padding: 8px 16px;
            border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 12px;
        }

        .bottom-actions { display: flex; gap: 20px; margin-top: auto; }
        .secondary-btn {
            flex: 1; border: 2px solid #000; border-radius: 12px; background: #fff;
            padding: 12px; font-weight: 600; cursor: pointer;
        }
        .dripscore-display {
            flex: 1; border: 2px solid #000; border-radius: 12px; background: #fff;
            padding: 12px; font-weight: 600; text-align: center;
            display: flex; align-items: center; justify-content: center; gap: 8px;
        }
      `}</style>
        </div>
    );
};

export default VendorVerification;
