import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, X, Check, Eye } from 'lucide-react';
import { marketplaceListingService } from '../../services/marketplaceListingService';
import './AdminLayout.css';

const MarketplaceListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedListing, setSelectedListing] = useState(null); // For Drawer
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchListings = async () => {
        setLoading(true);
        console.log('Fetching listings with filter:', filterStatus); // Debug log
        try {
            const data = await marketplaceListingService.getListings(filterStatus);
            console.log('Received listings:', data.length, 'items'); // Debug log
            // Transform data
            const formattedListings = data.map(l => ({
                id: l.id,
                title: l.title,
                seller: l.sellerName,
                category: l.category || 'Uncategorized',
                price: `₹${l.price}`,
                status: l.moderation_status === 'pending_review' ? 'pending' : l.moderation_status,
                date: new Date(l.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                img: (l.images && l.images.length > 0) ? l.images[0] : 'https://placehold.co/100x100?text=No+Img',
                description: l.description,
                adminNotes: l.admin_notes
            }));
            setListings(formattedListings);
        } catch (error) {
            console.error("Failed to load listings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, [filterStatus]);

    // Client-side Search Filter
    const filteredListings = listings.filter(l => {
        // Status filter is already applied by backend for optimization, but we keep search client-side for now
        const matchesSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase()) || l.seller.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const handleAction = async (id, action) => {
        try {
            if (action === 'approve') {
                await marketplaceListingService.approveListing(id);
            } else {
                const reason = selectedListing?.adminNotes || 'Violates community guidelines';
                await marketplaceListingService.rejectListing(id, reason);
            }

            if (selectedListing && selectedListing.id === id) {
                setSelectedListing(null); // Close drawer on action
            }

            // Optimistically remove from current list
            setListings(prev => prev.filter(l => l.id !== id));

            // Refresh to get updated data
            await fetchListings();
        } catch (error) {
            console.error('Action failed:', error);
            alert('Failed to update listing status');
        }
    };

    return (
        <div className="marketplace-page">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Marketplace Moderation</h1>
            </div>

            <div className="admin-card">
                {/* TOOLBAR */}
                <div className="table-toolbar">
                    <div className="search-wrapper">
                        <Search size={18} color="#9ca3af" />
                        <input
                            type="text"
                            placeholder="Search listings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="status-dropdown">
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="all">All Status</option>
                            <option value="pending">Pending Review</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                {/* TABLE */}
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Seller</th>
                            <th>Category</th>
                            <th>Created</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading listings...</td></tr>
                        ) : filteredListings.length === 0 ? (
                            <tr><td colSpan="6" className="empty-table">No listings found.</td></tr>
                        ) : (
                            filteredListings.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="product-cell">
                                            <img src={item.img} alt="" className="table-thumb" />
                                            <span className="p-title">{item.title}</span>
                                        </div>
                                    </td>
                                    <td>{item.seller}</td>
                                    <td><span className="cat-pill">{item.category}</span></td>
                                    <td>{item.date}</td>
                                    <td>
                                        <span className={`badge-pill badge-${item.status === 'pending' ? 'warning' : item.status === 'approved' ? 'active' : 'error'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="actions-cell">
                                            <button className="btn-icon-sm" onClick={() => setSelectedListing(item)} title="View Details">
                                                <Eye size={16} />
                                            </button>
                                            {item.status === 'pending' && (
                                                <>
                                                    <button className="btn-icon-sm success" onClick={() => handleAction(item.id, 'approve')} title="Approve">
                                                        <Check size={16} color="white" />
                                                    </button>
                                                    <button className="btn-icon-sm danger" onClick={() => handleAction(item.id, 'reject')} title="Reject">
                                                        <X size={16} color="white" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* DETAILS DRAWER */}
            {selectedListing && (
                <>
                    <div className="drawer-overlay" onClick={() => setSelectedListing(null)}></div>
                    <div className="detail-drawer">
                        <div className="drawer-header">
                            <h2>Listing Details</h2>
                            <button className="close-btn" onClick={() => setSelectedListing(null)}><X size={20} /></button>
                        </div>

                        <div className="drawer-content">
                            <div className="preview-image">
                                <img src={selectedListing.img} alt={selectedListing.title} />
                            </div>

                            <div className="drawer-info">
                                <h3>{selectedListing.title}</h3>
                                <div className="price">{selectedListing.price}</div>

                                <div className="info-block">
                                    <label>Seller</label>
                                    <div className="seller-name">{selectedListing.seller}</div>
                                </div>
                                <div className="info-block">
                                    <label>Category</label>
                                    <div>{selectedListing.category}</div>
                                </div>
                                <div className="info-block">
                                    <label>Description</label>
                                    <p>{selectedListing.description || 'No description provided.'}</p>
                                </div>

                                <div className="info-block">
                                    <label>Admin Notes</label>
                                    <textarea
                                        placeholder="Reason for rejection or notes..."
                                        rows={3}
                                        defaultValue={selectedListing.adminNotes}
                                        onChange={(e) => selectedListing.adminNotes = e.target.value}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="drawer-footer">
                            <button className="btn-reject" onClick={() => handleAction(selectedListing.id, 'reject')}>Reject</button>
                            <button className="btn-approve" onClick={() => handleAction(selectedListing.id, 'approve')}>Approve</button>
                        </div>
                    </div>
                </>
            )}

            <style>{`
                .marketplace-page { position: relative; }
                
                .table-toolbar {
                    display: flex; gap: 1rem; padding-bottom: 1.5rem; border-bottom: 1px solid #e5e7eb; margin-bottom: 1rem;
                }
                .search-wrapper {
                    flex: 1; display: flex; align-items: center; gap: 10px;
                    background: #f9fafb; border: 1px solid #d1d5db; border-radius: 8px; padding: 8px 12px;
                }
                .search-wrapper input { border: none; background: transparent; outline: none; width: 100%; font-size: 0.9rem; }
                .status-dropdown select {
                    padding: 9px 12px; border: 1px solid #d1d5db; border-radius: 8px; background: white; outline: none; cursor: pointer;
                }

                .admin-table { width: 100%; border-collapse: collapse; }
                .admin-table th { text-align: left; font-size: 0.75rem; color: #6b7280; text-transform: uppercase; padding: 1rem; border-bottom: 1px solid #e5e7eb; }
                .admin-table td { padding: 1rem; border-bottom: 1px solid #f3f4f6; color: #374151; font-size: 0.9rem; vertical-align: middle; }
                
                .product-cell { display: flex; align-items: center; gap: 12px; }
                .table-thumb { width: 40px; height: 40px; border-radius: 6px; object-fit: cover; background: #f3f4f6; }
                .p-title { font-weight: 500; color: #111827; }
                
                .cat-pill { background: #f3f4f6; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; color: #4b5563; }
                
                .actions-cell { display: flex; gap: 6px; }
                .btn-icon-sm {
                    width: 32px; height: 32px; border-radius: 6px; border: 1px solid #e5e7eb; background: white;
                    display: flex; align-items: center; justify-content: center; cursor: pointer; color: #6b7280;
                }
                .btn-icon-sm:hover { background: #f3f4f6; color: #111827; }
                
                /* FIX: Added proper colors for actions buttons to be visible */
                .btn-icon-sm.success { color: white; border-color: #059669; background: #059669; }
                .btn-icon-sm.success:hover { background: #047857; border-color: #047857; }
                
                .btn-icon-sm.danger { color: white; border-color: #dc2626; background: #dc2626; }
                .btn-icon-sm.danger:hover { background: #b91c1c; border-color: #b91c1c; }

                .empty-table { padding: 3rem; text-align: center; color: #9ca3af; }

                /* Drawer */
                .drawer-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.3); z-index: 60;
                }
                .detail-drawer {
                    position: fixed; top: 0; right: 0; width: 400px; height: 100%;
                    background: white; z-index: 70; box-shadow: -5px 0 25px rgba(0,0,0,0.1);
                    display: flex; flex-direction: column;
                }
                .drawer-header {
                    padding: 1.5rem; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;
                }
                .drawer-header h2 { font-size: 1.25rem; font-weight: 600; margin: 0; }
                .close-btn { background: none; border: none; cursor: pointer; color: #6b7280; }
                
                .drawer-content { flex: 1; overflow-y: auto; padding: 1.5rem; }
                .preview-image {
                    width: 100%; height: 250px; background: #f9fafb; display: flex; align-items: center; justify-content: center;
                    border-radius: 8px; margin-bottom: 1.5rem; overflow: hidden;
                }
                .preview-image img { width: 100%; height: 100%; object-fit: cover; }
                
                .drawer-info h3 { font-size: 1.1rem; margin: 0 0 0.5rem 0; }
                .price { font-size: 1.25rem; font-weight: 700; color: #111827; margin-bottom: 1.5rem; }
                
                .info-block { margin-bottom: 1.25rem; }
                .info-block label { display: block; font-size: 0.75rem; font-weight: 600; color: #9ca3af; text-transform: uppercase; margin-bottom: 4px; }
                .info-block p { font-size: 0.9rem; color: #4b5563; line-height: 1.5; margin: 0; }
                .info-block textarea { 
                    width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; outline: none; font-family: inherit;
                }

                .drawer-footer {
                    padding: 1.5rem; border-top: 1px solid #e5e7eb; display: flex; gap: 1rem;
                }
            `}</style>
        </div>
    );
};

export default MarketplaceListings;
