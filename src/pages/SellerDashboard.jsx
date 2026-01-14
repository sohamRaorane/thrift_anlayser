import { useEffect, useState } from 'react'
import { useNavigate, NavLink, Outlet } from 'react-router-dom'
import { BarChart3, MessageSquare, CheckCircle, ShoppingBag, Megaphone, Star, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'
import './SellerDashboard.css'

function SellerDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

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

  const displayName = user?.user_metadata?.full_name || user?.email || 'Seller'
  const isVerified = user?.user_metadata?.plan === 'verified'

  return (
    <section className="page seller-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Seller Dashboard</h1>
          <div className="user-welcome-row">
            <span className="seller-welcome">Welcome, {displayName}</span>
            {isVerified && (
              <span className="header-verified-badge">
                <Star size={10} fill="currentColor" stroke="none" />
                VERIFIED
              </span>
            )}
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} strokeWidth={2} />
          Sign Out
        </button>
      </header>

      <div className="seller-dashboard-grid">
        {/* Sidebar Navigation */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <BarChart3 size={18} strokeWidth={2} />
              DripScore Metrics
            </NavLink>
            <NavLink
              to="/dashboard/seller/inbox"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <MessageSquare size={18} strokeWidth={2} />
              Complaint Inbox
            </NavLink>
            <NavLink
              to="/dashboard/seller/tips"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <CheckCircle size={18} strokeWidth={2} />
              Verification Tips
            </NavLink>
            <NavLink
              to="/dashboard/seller/marketplace-preview"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <ShoppingBag size={18} strokeWidth={2} />
              View Marketplace
            </NavLink>
            <NavLink
              to="/dashboard/seller/promote"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Megaphone size={18} strokeWidth={2} />
              Promote Store
            </NavLink>
            <NavLink
              to="/dashboard/seller/plan"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Star size={18} strokeWidth={2} />
              FAD Verified Plan
            </NavLink>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </section>
  )
}

export default SellerDashboard