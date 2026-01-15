import React, { useState, useEffect } from 'react';
import { complaintsService } from '../../services/complaintsService';
import {
    AlertCircle,
    CheckCircle,
    MessageSquare,
    FileText,
    Download,
    Loader
} from 'lucide-react';
import './AdminLayout.css';

const ComplaintsPage = () => {
    const [complaints, setComplaints] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adminNote, setAdminNote] = useState('');
    const [saving, setSaving] = useState(false);

    // Derived state for the selected ticket
    // We use the raw UUID (selectedId) to find the ticket
    const selectedTicket = complaints.find(c => c.raw_id === selectedId);

    useEffect(() => {
        loadComplaints();
    }, []);

    useEffect(() => {
        // Reset note when ticket changes
        if (selectedTicket) {
            setAdminNote(selectedTicket.notes || '');
        }
    }, [selectedId, selectedTicket]);

    const loadComplaints = async () => {
        setLoading(true);
        try {
            const data = await complaintsService.getTickets();
            setComplaints(data);
            if (data.length > 0 && !selectedId) {
                setSelectedId(data[0].raw_id);
            }
        } catch (error) {
            console.error("Failed to load tickets", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        if (!selectedId) return;
        setSaving(true);
        try {
            await complaintsService.updateStatus(selectedId, newStatus);
            // Optimistic Update
            setComplaints(prev => prev.map(c => c.raw_id === selectedId ? { ...c, status: newStatus } : c));
            alert(`Ticket marked as ${newStatus}`);
        } catch (error) {
            alert("Failed to update status");
        } finally {
            setSaving(false);
        }
    };

    const saveNotes = async () => {
        if (!selectedId) return;
        setSaving(true);
        try {
            await complaintsService.updateNotes(selectedId, adminNote);
            // Optimistic Update
            setComplaints(prev => prev.map(c => c.raw_id === selectedId ? { ...c, notes: adminNote } : c));
            alert('Notes saved successfully.');
        } catch (error) {
            alert("Failed to save notes");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="admin-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading tickets...</div>;

    return (
        <div className="complaints-page" style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
            <div className="admin-page-header">
                <h1 className="admin-page-title">Resolve Tickets &#123;COMPLAINTS&#125;</h1>
            </div>

            <div style={{ display: 'flex', gap: '2rem', flex: 1, overflow: 'hidden' }}>

                {/* Left Panel: Ticket List / Selection */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
                    <div className="admin-card" style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', padding: '0.75rem', color: '#6b7280' }}>
                            SELECT ACTIVE TICKET
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1 }}>
                            {complaints.length === 0 ? (
                                <div style={{ padding: '20px', color: '#9ca3af', textAlign: 'center' }}>No tickets found.</div>
                            ) : (
                                complaints.map(ticket => (
                                    <div
                                        key={ticket.raw_id}
                                        onClick={() => setSelectedId(ticket.raw_id)}
                                        style={{
                                            padding: '1rem',
                                            borderBottom: '1px solid #f3f4f6',
                                            cursor: 'pointer',
                                            backgroundColor: selectedId === ticket.raw_id ? '#f9fafb' : 'white',
                                            borderLeft: selectedId === ticket.raw_id ? '4px solid #111827' : '4px solid transparent',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{ticket.id}</span>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                color: ticket.status === 'Open' ? '#ef4444' :
                                                    ticket.status === 'Resolved' ? '#059669' : '#d97706'
                                            }}>
                                                {ticket.status}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {ticket.issue}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>
                                            {ticket.vendor} • {ticket.buyer}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Status Flow Visualization */}
                    {selectedTicket && (
                        <div className="admin-card" style={{ flexShrink: 0 }}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>TICKET STATUS</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginLeft: '1rem', borderLeft: '2px solid #e5e7eb', paddingLeft: '1.5rem', position: 'relative' }}>
                                {['Open', 'In Review', 'Resolved', 'Escalated'].map((step, idx) => {
                                    const isActive = selectedTicket.status === step;
                                    const statusOrder = ['Open', 'In Review', 'Resolved', 'Escalated'];
                                    const isPast = statusOrder.indexOf(selectedTicket.status) > idx;

                                    return (
                                        <div key={step} style={{ position: 'relative' }}>
                                            <div style={{
                                                position: 'absolute',
                                                left: '-31px',
                                                top: '0',
                                                width: '16px',
                                                height: '16px',
                                                borderRadius: '50%',
                                                backgroundColor: isActive ? '#111827' : isPast ? '#9ca3af' : 'white',
                                                border: '2px solid',
                                                borderColor: isActive || isPast ? '#111827' : '#d1d5db'
                                            }} />
                                            <div
                                                onClick={() => handleStatusUpdate(step)}
                                                style={{
                                                    fontWeight: isActive ? '700' : '400',
                                                    color: isActive ? '#111827' : '#6b7280',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {step}
                                            </div>
                                            {isActive && <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '4px' }}>Current Stage</div>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel: Ticket Detail (FIXED LAYOUT) */}
                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {selectedTicket ? (
                        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0, overflow: 'hidden' }}>

                            {/* Fixed Header */}
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>Ticket {selectedTicket.id}</h2>
                                        <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                                            Created by <strong>{selectedTicket.buyer}</strong> regarding order from <strong>{selectedTicket.vendor}</strong>
                                        </div>
                                    </div>
                                    <div className={`badge-pill ${selectedTicket.status === 'Open' ? 'badge-error' : selectedTicket.status === 'Resolved' ? 'badge-active' : 'badge-warning'}`}>
                                        {selectedTicket.status}
                                    </div>
                                </div>
                            </div>

                            {/* Scrollable Content Area */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                                        BUYER COMPLAINT
                                    </label>
                                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', color: '#1f2937', lineHeight: '1.5' }}>
                                        {selectedTicket.full_text || selectedTicket.issue}
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                                        EVIDENCE / PROOFS
                                    </label>
                                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                        {selectedTicket.evidence && selectedTicket.evidence.length > 0 ? selectedTicket.evidence.map((file, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white', cursor: 'pointer' }}>
                                                <FileText size={16} color="#4b5563" />
                                                <span style={{ fontSize: '0.9rem', color: '#374151' }}>{file}</span>
                                                <Download size={14} color="#6b7280" />
                                            </div>
                                        )) : (
                                            <span style={{ color: '#9ca3af', fontSize: '0.9rem', fontStyle: 'italic' }}>No files uploaded.</span>
                                        )}
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                                        ADMIN NOTES & INTERNAL REVIEW
                                    </label>
                                    <textarea
                                        value={adminNote}
                                        onChange={(e) => setAdminNote(e.target.value)}
                                        placeholder="Type your notes here..."
                                        style={{ width: '100%', minHeight: '150px', padding: '1rem', borderRadius: '8px', border: '1px solid #d1d5db', resize: 'vertical', fontFamily: 'inherit' }}
                                    />
                                </div>
                            </div>

                            {/* Fixed Footer Actions - Always Visible */}
                            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb', display: 'flex', justifyContent: 'flex-end', gap: '1rem', flexShrink: 0 }}>
                                <button
                                    onClick={saveNotes}
                                    disabled={saving}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '6px',
                                        border: '1px solid #d1d5db', background: 'white', color: '#374151', fontWeight: '600', cursor: saving ? 'wait' : 'pointer',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    {saving && <Loader size={14} className="spin" />}
                                    Save Notes
                                </button>

                                {selectedTicket.status !== 'Resolved' && (
                                    <button
                                        onClick={() => handleStatusUpdate('Resolved')}
                                        disabled={saving}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '6px',
                                            background: '#111827', color: 'white', border: 'none', fontWeight: '600', cursor: saving ? 'wait' : 'pointer',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <CheckCircle size={16} />
                                        Mark as Resolved
                                    </button>
                                )}

                                {selectedTicket.status === 'Open' && (
                                    <button
                                        onClick={() => handleStatusUpdate('In Review')}
                                        disabled={saving}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '6px',
                                            background: '#fffbeb', color: '#b45309', border: '1px solid #fcd34d', fontWeight: '600', cursor: saving ? 'wait' : 'pointer'
                                        }}
                                    >
                                        <MessageSquare size={16} />
                                        Start Review
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="admin-card" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                            Select a ticket to view details.
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default ComplaintsPage;
