import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function SellerDashboardHome() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkUser()
    }, [])

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        setLoading(false)
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="verification-panel">
            <h2>Verification Summary</h2>

            <div className="verification-grid">
                <div className="verification-item">
                    <div className="item-header">
                        <span className="item-label">Instagram Ownership</span>
                        <span className="status-badge verified">Verified</span>
                    </div>
                    <p className="item-detail">Connected: {user?.user_metadata?.instagram_url || 'Not provided'}</p>
                </div>

                <div className="verification-item">
                    <div className="item-header">
                        <span className="item-label">Contact Verification</span>
                        <span className="status-badge verified">Verified</span>
                    </div>
                    <p className="item-detail">Email: {user?.email}</p>
                </div>

                <div className="verification-item">
                    <div className="item-header">
                        <span className="item-label">GSTIN</span>
                        <span className="status-badge pending">Not Provided</span>
                    </div>
                    <p className="item-detail">{user?.user_metadata?.gstin || 'No GSTIN registered'}</p>
                </div>

                <div className="verification-item">
                    <div className="item-header">
                        <span className="item-label">Drip Score</span>
                        <span className="status-badge neutral">Neutral</span>
                    </div>
                    <p className="item-detail">No reviews yet</p>
                </div>
            </div>

            <div className="overview-section">
                <h3>Overview</h3>
                <p>Your store is currently under verification. Once approved, you'll be listed on the FAD marketplace.</p>
                <p className="muted">Verification typically takes 2-3 business days.</p>
            </div>
        </div>
    )
}

export default SellerDashboardHome
