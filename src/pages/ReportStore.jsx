import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ReportStore.css'

function ReportStore() {
    const navigate = useNavigate()
    const [instagramUsername, setInstagramUsername] = useState('')
    const [reason, setReason] = useState('')
    const [files, setFiles] = useState([])

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle form submission
        console.log({ instagramUsername, reason, files })
        // Show success message or redirect
    }

    return (
        <section className="page report-store">
            <header className="report-header">
                <div className="breadcrumb" onClick={() => navigate(-1)}>
                    <span className="chevron">←</span>
                    <span>Back</span>
                </div>
                <h1>File A Report</h1>
            </header>

            <div className="report-shell">
                <form onSubmit={handleSubmit} className="report-form">
                    {/* Instagram Account */}
                    <div className="form-section">
                        <label className="form-label">
                            <span className="label-icon">📷</span>
                            <span className="label-text">Instagram Account</span>
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Enter the Instagram username...."
                            value={instagramUsername}
                            onChange={(e) => setInstagramUsername(e.target.value)}
                            required
                        />
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
                                <div className="upload-icon">↑</div>
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
                        <button type="submit" className="submit-btn">
                            Submit Report
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default ReportStore
