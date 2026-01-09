import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { fetchVendorComplaints, resolveComplaint } from '../lib/supabaseData';
import { X, CheckCircle2, MessageSquare } from 'lucide-react';
import './ComplaintInbox.css';

const ComplaintInbox = () => {
    const [showModal, setShowModal] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeComplaint, setActiveComplaint] = useState(null);
    const [responseText, setResponseText] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    // Initial fetch
    useEffect(() => {
        const init = async () => {
            const { data, error } = await supabase.auth.getUser();

            if (error) {
                console.error('Error fetching auth user:', error);
                setLoading(false);
                return;
            }

            const user = data?.user;
            if (user) {
                setCurrentUser(user);
                // In this app, the vendor's primary key is the auth user's id
                // (see PromoteStore where vendors.id is set to user.id),
                // so we can query complaints directly by vendor_id = user.id.
                await loadComplaints(user.id);
            }

            setLoading(false);
        };
        init();
    }, []);

    const loadComplaints = async (vendorId) => {
        const data = await fetchVendorComplaints(vendorId);
        setComplaints(data || []);
    };

    const handleResolve = async (e) => {
        e.preventDefault();
        if (!activeComplaint) return;

        try {
            await resolveComplaint(activeComplaint.id, responseText);

            // Optimistic update or refetch
            setComplaints(prev => prev.map(c =>
                c.id === activeComplaint.id
                    ? { ...c, status: 'resolved', public_response: responseText, resolved_at: new Date().toISOString() }
                    : c
            ));

            setShowModal(false);
            setResponseText('');
            setActiveComplaint(null);
        } catch (error) {
            console.error('Failed to resolve:', error);
            alert('Failed to submit resolution. Please try again.');
        }
    };

    const openResolveModal = (complaint) => {
        setActiveComplaint(complaint);
        setResponseText('');
        setShowModal(true);
    };

    // Filter active vs history
    // Logic: Show the first "open" complaint as the active card.
    // Use others for history or "No other open complaints".
    const activeOpenComplaint = complaints.find(c => c.status !== 'resolved');
    const resolvedComplaints = complaints.filter(c => c.status === 'resolved');

    if (loading) return <div className="inbox-shell">Loading...</div>;

    // If no open complaints, show a "All caught up" state or the last resolved one?
    // The original UI showed a specific card. Let's try to show the active one, or if none, maybe the most recent resolved one.
    const displayComplaint = activeOpenComplaint || complaints[0];

    if (!displayComplaint) {
        return (
            <div className="inbox-shell">
                <div className="complaint-card">
                    <div className="card-header-row">
                        <h3 className="complaint-title">No Complaints</h3>
                    </div>
                    <div className="complaint-footer">
                        <p>You have no active or past complaints.</p>
                    </div>
                </div>
            </div>
        );
    }

    const isResolved = displayComplaint.status === 'resolved';

    return (
        <div className="inbox-shell">
            <div className={`complaint-card ${isResolved ? 'resolved-card' : ''}`}>
                <div className="card-header-row">
                    <h3 className="complaint-title">Complaint #{displayComplaint.id.toString().slice(-3)}</h3>
                    {isResolved && <span className="resolved-badge">RESOLVED</span>}
                </div>

                <div className="complaint-details">
                    <p className="detail-row"><span className="label">Type:</span> {displayComplaint.issue_type || 'General Issue'}</p>
                    <p className="detail-row"><span className="label">Date:</span> {new Date(displayComplaint.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    <p className="detail-row"><span className="label">Details:</span> {displayComplaint.description || 'None provided'}</p>
                </div>

                {isResolved ? (
                    <div className="resolution-record">
                        <div className="record-header">
                            <CheckCircle2 size={16} />
                            <span>Public Response Recorded</span>
                        </div>
                        <p className="record-text">"{displayComplaint.public_response}"</p>
                        <span className="record-date">
                            {new Date(displayComplaint.resolved_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                    </div>
                ) : (
                    <div className="complaint-actions">
                        <button
                            className="action-button primary"
                            onClick={() => openResolveModal(displayComplaint)}
                        >
                            Respond Publicly / Mark Resolved
                        </button>
                    </div>
                )}

                <div className="complaint-footer">
                    <p>{!activeOpenComplaint ? 'No other open complaints' : `${complaints.filter(c => c.status !== 'resolved').length - 1} other open complaints`}</p>
                    <button className="history-toggle-btn" onClick={() => setShowHistory(true)}>
                        View Complaint History
                    </button>
                </div>
            </div>

            {/* Response Modal */}
            {showModal && activeComplaint && (
                <div className="modal-overlay">
                    <div className="modal-content complaint-modal">
                        <div className="modal-header">
                            <h3>Resolve Complaint #{activeComplaint.id.toString().slice(-3)}</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleResolve} className="response-form">
                            <p className="modal-context">
                                You are about to mark this complaint as resolved.
                                Please provide a brief public response for the buyer and platform record.
                            </p>

                            <div className="form-group">
                                <label>Public Response</label>
                                <textarea
                                    rows="4"
                                    placeholder="e.g. We have processed a full refund and apologized for the delay."
                                    value={responseText}
                                    onChange={(e) => setResponseText(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="launch-btn">Confirm Resolution</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* History Modal (Basic Implementation) */}
            {showHistory && (
                <div className="modal-overlay">
                    <div className="modal-content history-modal">
                        <div className="modal-header">
                            <h3>Complaint History</h3>
                            <button className="close-btn" onClick={() => setShowHistory(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="history-list">
                            {complaints.length === 0 ? (
                                <p>No history found.</p>
                            ) : (
                                complaints.map(c => (
                                    <div key={c.id} className="history-item">
                                        <div className="history-header">
                                            <span>#{c.id.toString().slice(-3)} - {c.issue_type}</span>
                                            <span className="history-date">{new Date(c.created_at).toLocaleDateString()}</span>
                                        </div>
                                        {c.status === 'resolved' ? (
                                            <span className="history-status resolved">Resolved</span>
                                        ) : (
                                            <span className="history-status open" style={{ color: 'var(--accent-color)' }}>Open</span>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplaintInbox;
