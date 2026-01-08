import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, MessageSquare, CheckCircle, ShoppingBag, Megaphone, Star, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'
import './SellerDashboard.css'

function SellerDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      navigate('/') // Redirect to home if not logged in
    } else {
      setUser(user)
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) {
    return <div className="page">Loading...</div>
  }

  return (
    <section className="page seller-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Seller Dashboard</h1>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} strokeWidth={2} />
          Sign Out
        </button>
      </header>

      <div className="dashboard-grid">
        {/* Sidebar Navigation */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <button className="nav-item active">
              <BarChart3 size={18} strokeWidth={2} />
              DripScore Metrics
            </button>
            <button className="nav-item">
              <MessageSquare size={18} strokeWidth={2} />
              Complaint Inbox
            </button>
            <button className="nav-item">
              <CheckCircle size={18} strokeWidth={2} />
              Verification Tips
            </button>
            <button className="nav-item">
              <ShoppingBag size={18} strokeWidth={2} />
              View Marketplace
            </button>
            <button className="nav-item">
              <Megaphone size={18} strokeWidth={2} />
              Promote Store
            </button>
            <button className="nav-item">
              <Star size={18} strokeWidth={2} />
              FAD Verified Plan
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
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
        </main>
      </div>
    </section>
  )
}

export default SellerDashboard