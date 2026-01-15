import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, Check, Trash2, Filter, Star } from 'lucide-react';
import { reviewModerationService } from '../../services/reviewModerationService';
import './AdminLayout.css';

const ReviewModeration = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterFlagged, setFilterFlagged] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const data = await reviewModerationService.getReviews(filterFlagged ? 'flagged' : 'all');
            // Transform data to match UI expectations
            const formattedReviews = data.map(r => ({
                id: r.id,
                user: r.reviewer_name || 'Anonymous Buyer', // Fallback if no user name
                store: r.vendorName,
                rating: r.rating,
                text: r.comment || '',
                date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                status: r.moderation_status,
                reason: r.flag_reason
            }));
            setReviews(formattedReviews);
        } catch (error) {
            console.error('Failed to load reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [filterFlagged]);

    // Client-side search filtering
    const filteredReviews = reviews.filter(r => {
        const storeName = r.store || '';
        const reviewText = r.text || '';
        return storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reviewText.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleAction = async (id, action) => {
        if (!window.confirm(`Are you sure you want to ${action === 'remove' ? 'remove' : 'mark safe'} this review?`)) return;

        try {
            if (action === 'remove') {
                await reviewModerationService.removeReview(id);
            } else {
                await reviewModerationService.markSafe(id);
            }
            // Refresh list to show updated status
            fetchReviews();
        } catch (error) {
            console.error('Action failed:', error);
            alert('Failed to update review status');
        }
    };

    return (
        <div className="reviews-page">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Review Moderation</h1>
            </div>

            <div className="admin-card">
                {/* TOOLBAR */}
                <div className="toolbar-row">
                    <div className="search-bar">
                        <Search size={16} color="#9ca3af" />
                        <input
                            type="text"
                            placeholder="Search by store or content..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="toggles">
                        <button
                            className={`toggle-btn ${filterFlagged ? 'active' : ''}`}
                            onClick={() => setFilterFlagged(true)}
                        >
                            <AlertTriangle size={14} /> Flagged Only
                        </button>
                        <button
                            className={`toggle-btn ${!filterFlagged ? 'active' : ''}`}
                            onClick={() => setFilterFlagged(false)}
                        >
                            All Reviews
                        </button>
                    </div>
                </div>

                {/* REVIEWS LIST */}
                <div className="reviews-list">
                    {loading ? (
                        <div className="loading-state" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading reviews...</div>
                    ) : filteredReviews.length === 0 ? (
                        <div className="empty-state">No {filterFlagged ? 'flagged' : ''} reviews found.</div>
                    ) : (
                        filteredReviews.map(review => (
                            <div key={review.id} className={`review-row ${review.status === 'removed' ? 'dimmed' : ''}`}>
                                <div className="review-main">
                                    <div className="r-header">
                                        <div className="r-rating">
                                            <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                                            <span>{review.rating}.0</span>
                                        </div>
                                        <span className="r-store">for <b>{review.store}</b></span>
                                        <span className="r-date">{review.date}</span>
                                    </div>
                                    <p className="r-text">"{review.text}"</p>
                                    <div className="r-meta">
                                        <span className="r-user">by {review.user}</span>
                                        {review.status === 'flagged' && (
                                            <span className="flag-badge">
                                                <AlertTriangle size={12} /> {review.reason}
                                            </span>
                                        )}
                                        {review.status === 'published' && <span className="status-badge success">Published</span>}
                                        {review.status === 'removed' && <span className="status-badge danger">Removed</span>}
                                    </div>
                                </div>

                                <div className="review-actions">
                                    {review.status !== 'removed' && (
                                        <>
                                            <button className="action-btn safe" onClick={() => handleAction(review.id, 'safe')} title="Mark Safe">
                                                <Check size={16} /> Mark Safe
                                            </button>
                                            <button className="action-btn remove" onClick={() => handleAction(review.id, 'remove')} title="Remove">
                                                <Trash2 size={16} /> Remove
                                            </button>
                                        </>
                                    )}
                                    {review.status === 'removed' && (
                                        <button className="action-btn restore" onClick={() => handleAction(review.id, 'safe')} title="Restore">
                                            Restore
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style>{`
                .toolbar-row {
                    display: flex; justify-content: space-between; align-items: center;
                    padding-bottom: 1.5rem; border-bottom: 1px solid #e5e7eb; margin-bottom: 1rem;
                }
                .search-bar {
                    display: flex; align-items: center; gap: 8px; background: #f9fafb;
                    border: 1px solid #d1d5db; padding: 8px 12px; border-radius: 8px; width: 300px;
                }
                .search-bar input { border: none; background: transparent; outline: none; width: 100%; font-size: 0.9rem; }

                .toggles { display: flex; background: #f3f4f6; padding: 4px; border-radius: 8px; }
                .toggle-btn {
                    border: none; background: transparent; padding: 6px 12px; font-size: 0.85rem; font-weight: 500;
                    color: #6b7280; cursor: pointer; border-radius: 6px; display: flex; align-items: center; gap: 6px;
                }
                .toggle-btn.active { background: white; color: #111827; shadow: 0 1px 2px rgba(0,0,0,0.05); }

                .reviews-list { display: flex; flex-direction: column; }
                .review-row {
                    display: flex; justify-content: space-between; align-items: flex-start;
                    padding: 1.5rem 0; border-bottom: 1px solid #f3f4f6;
                }
                .review-row:last-child { border-bottom: none; }
                .review-row.dimmed { opacity: 0.5; background: #f9fafb; padding: 1.5rem; border-radius: 8px; }

                .review-main { flex: 1; padding-right: 2rem; }
                .r-header { display: flex; align-items: center; gap: 10px; margin-bottom: 0.5rem; }
                .r-rating { display: flex; align-items: center; gap: 4px; font-weight: 700; color: #111827; }
                .r-store { color: #374151; font-size: 0.9rem; }
                .r-date { color: #9ca3af; font-size: 0.8rem; margin-left: auto; }
                
                .r-text { font-size: 1rem; color: #4b5563; line-height: 1.5; margin-bottom: 0.75rem; font-style: italic; }
                
                .r-meta { display: flex; align-items: center; gap: 1rem; }
                .r-user { font-size: 0.85rem; font-weight: 500; color: #6b7280; }
                
                .flag-badge {
                    display: flex; align-items: center; gap: 4px;
                    background: #fef2f2; color: #dc2626; font-size: 0.75rem; font-weight: 600;
                    padding: 2px 8px; border-radius: 12px;
                }
                 .status-badge { font-size: 0.75rem; font-weight: 600; padding: 2px 8px; border-radius: 12px; }
                 .success { background: #ecfdf5; color: #059669; }
                 .danger { background: #fef2f2; color: #dc2626; }

                .review-actions { display: flex; gap: 0.5rem; }
                .action-btn {
                    padding: 6px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: 500;
                    cursor: pointer; display: flex; align-items: center; gap: 6px; border: 1px solid transparent;
                }
                .safe { background: white; border-color: #d1d5db; color: #374151; }
                .safe:hover { border-color: #059669; color: #059669; background: #ecfdf5; }
                .remove { background: white; border-color: #d1d5db; color: #dc2626; }
                .remove:hover { background: #fef2f2; border-color: #ef4444; }
                .restore { color: #2563eb; background: none; border: none; text-decoration: underline; }

                .empty-state { padding: 3rem; text-align: center; color: #9ca3af; }
            `}</style>
        </div>
    );
};

export default ReviewModeration;
