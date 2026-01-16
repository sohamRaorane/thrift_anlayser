import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Upload } from 'lucide-react'
import { authService } from '../services/authService'
import { complaintsService } from '../services/complaintsService'
import { analyticsService } from '../services/analyticsService' // Re-using to get seller list
import './ReportStore.css'

function ReportStore() {
    const navigate = useNavigate()
    const location = useLocation()
    const [vendors, setVendors] = useState([])
    const [selectedVendor, setSelectedVendor] = useState('')
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Searchable Dropdown State
    const [searchTerm, setSearchTerm] = useState('')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [filteredVendors, setFilteredVendors] = useState([])

    // Form Stats
    const [reason, setReason] = useState('')
    const [files, setFiles] = useState([])

    useEffect(() => {
        // 1. Check Auth
        const checkAuth = async () => {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
        };

        // 2. Load Vendors
        const loadVendors = async () => {
            try {
                // Fetch basic vendor list (id, business_name, store_name, instagram_handle)
                const data = await analyticsService.getSellers();
                setVendors(data);
                setFilteredVendors(data);

                // Restore draft if exists
                const draft = sessionStorage.getItem('report_draft');
                if (draft) {
                    const parsed = JSON.parse(draft);
                    if (parsed.selectedVendor) {
                        const vendor = data.find(v => v.id === parsed.selectedVendor);
                        if (vendor) {
                            setSelectedVendor(parsed.selectedVendor);
                            setSearchTerm(vendor.business_name || vendor.store_name);
                        }
                    } else if (parsed.searchTerm) {
                        setSearchTerm(parsed.searchTerm);
                    }
                    if (parsed.reason) setReason(parsed.reason);

                    // Clear after restoring
                    sessionStorage.removeItem('report_draft');
                }

            } catch (err) {
                console.error("Failed to load vendors", err);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
        loadVendors();

        // Listen for auth changes
        const { data: authListener } = authService.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };

    }, []);


    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files))
    }

    const handleLogin = () => {
        // Save draft state
        sessionStorage.setItem('report_draft', JSON.stringify({
            searchTerm,
            selectedVendor,
            reason
        }));
        // Redirect to Auth Page with return URL
        navigate('/auth', { state: { from: location } });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            const confirmLogin = window.confirm("You must be logged in to file a report. Sign in now?");
            if (confirmLogin) handleLogin();
            return;
        }

        if (!selectedVendor) {
            alert("Please select a store to report.");
            return;
        }

        try {
            // Logic to upload evidence would go here (authService.uploadEvidence - not yet implemented)
            // For now, we will create the ticket record

            const ticketCode = 'T-' + Math.floor(1000 + Math.random() * 9000); // Simple random T-XXXX

            const ticketPayload = {
                ticket_code: ticketCode,
                seller_id: selectedVendor, // Schema uses 'seller_id'
                buyer_name: user.user_metadata?.full_name || user.email,
                issue_summary: reason.substring(0, 50) + "...",
                complaint_text: reason,
                status: 'Open' // Schema uses Title Case 'Open' default
            };

            await complaintsService.createTicket(ticketPayload);
            alert("Report submitted successfully!");
            navigate('/');

        } catch (err) {
            console.error(err);
            alert("Failed to submit report. Please try again.");
        }
    }

    return (
        <section className="page report-store">
            <header className="report-header">
                <div className="breadcrumb" onClick={() => navigate(-1)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ArrowLeft size={16} />
                    <span>Back</span>
                </div>
                <h1>File A Report</h1>
            </header>

            <div className="report-shell">
                <form onSubmit={handleSubmit} className="report-form">
                    {/* Store Selector */}
                    <div className="form-section">
                        <label className="form-label">
                            <span className="label-text">Select Store to Report</span>
                        </label>
                        {loading ? (
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>Loading stores...</p>
                        ) : (
                            <div className="combobox-wrapper">
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Type store name or instagram handle..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        const term = e.target.value;
                                        setSearchTerm(term);
                                        setIsDropdownOpen(true);
                                        // Clear selection if typing (optional, but good for UX so they don't submit mismatched id/text)
                                        if (selectedVendor) setSelectedVendor('');

                                        const lowerTerm = term.toLowerCase();
                                        setFilteredVendors(vendors.filter(v =>
                                            (v.business_name && v.business_name.toLowerCase().includes(lowerTerm)) ||
                                            (v.store_name && v.store_name.toLowerCase().includes(lowerTerm)) ||
                                            (v.instagram_handle && v.instagram_handle.toLowerCase().includes(lowerTerm))
                                        ));
                                    }}
                                    onFocus={() => setIsDropdownOpen(true)}
                                    onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                                    // Use autoComplete off to prevent browser suggestions covering the dropdown
                                    autoComplete="off"
                                    required={!selectedVendor}
                                />
                                {isDropdownOpen && filteredVendors.length > 0 && (
                                    <div className="combobox-options">
                                        {filteredVendors.map(v => (
                                            <div
                                                key={v.id}
                                                className="combobox-option"
                                                onMouseDown={() => {
                                                    setSelectedVendor(v.id);
                                                    setSearchTerm(v.business_name || v.store_name);
                                                    setIsDropdownOpen(false);
                                                }}
                                            >
                                                <div className="combobox-option-title">{v.business_name || v.store_name}</div>
                                                <div className="combobox-option-subtitle">@{v.instagram_handle}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {isDropdownOpen && filteredVendors.length === 0 && (
                                    <div className="combobox-options" style={{ padding: '12px', color: 'var(--text-muted)' }}>
                                        No matching stores found.
                                    </div>
                                )}
                            </div>
                        )}
                        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '6px' }}>
                            Can't find the store? Make sure they are registered on our platform.
                        </p>
                    </div>

                    {/* Reason */}
                    <div className="form-section">
                        <label className="form-label">
                            <span className="label-text">Why do you think the store is a Scam?</span>
                        </label>
                        <textarea
                            className="form-textarea"
                            placeholder="Explain why do you think the store is suspicious"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={6}
                            required
                        />
                    </div>

                    {/* File Upload */}
                    <div className="form-section">
                        <label className="upload-area">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className="file-input"
                            />
                            <div className="upload-content">
                                <div className="upload-icon"><Upload size={24} /></div>
                                <div className="upload-text">
                                    <p className="upload-title">Upload</p>
                                    <p className="upload-subtitle">
                                        Upload screenshots of stories/reels/posts/deliverables as proof
                                    </p>
                                </div>
                            </div>
                            {files.length > 0 && (
                                <div className="file-list">
                                    {files.map((file, index) => (
                                        <div key={index} className="file-item">
                                            {file.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="form-actions">
                        {!user ? (
                            <button type="button" onClick={handleLogin} className="submit-btn" style={{ background: '#333' }}>
                                Sign in to Report
                            </button>
                        ) : (
                            <button type="submit" className="submit-btn">
                                Submit Report
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </section>
    )
}

export default ReportStore
