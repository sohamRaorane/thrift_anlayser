import { useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import EntryPage from './pages/EntryPage.jsx'
import Discover from './pages/Discover.jsx'
import VendorProfile from './pages/VendorProfile.jsx'
import SubmitReview from './pages/SubmitReview.jsx'
import ReportStore from './pages/ReportStore.jsx'
import SellerDashboard from './pages/SellerDashboard.jsx'
import SellerDashboardHome from './pages/SellerDashboardHome.jsx'
import SellerOnboarding from './pages/SellerOnboarding.jsx'
import ComplaintInbox from './pages/ComplaintInbox.jsx'
import VerificationTips from './pages/VerificationTips.jsx'
import MarketplacePreview from './pages/MarketplacePreview.jsx'
import PromoteStore from './pages/PromoteStore.jsx'
import VerifiedPlan from './pages/VerifiedPlan.jsx'
import AuthModal from './components/AuthModal.jsx'
import AuthPage from './pages/AuthPage.jsx'
import Footer from './components/Footer.jsx'
import './App.css'

// Admin Components
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import CertificatesPage from './pages/admin/CertificatesPage.jsx'
import SellerAnalyticsPage from './pages/admin/SellerAnalyticsPage.jsx'
import ComplaintsPage from './pages/admin/ComplaintsPage.jsx'
import SubscriptionsPage from './pages/admin/SubscriptionsPage.jsx'
import ReviewModeration from './pages/admin/ReviewModeration.jsx'
import VendorVerification from './pages/admin/VendorVerification.jsx'
import MarketplaceListings from './pages/admin/MarketplaceListings.jsx'

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Get current date in vintage newspaper format
  const today = new Date()
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  const formattedDate = today.toLocaleDateString('en-US', options)

  const handleSellerDeskClick = (e) => {
    e.preventDefault()
    setShowAuthModal(true)
  }

  const handleLoginSuccess = () => {
    window.location.href = '/dashboard'
  }

  return (
    <div className={isAdminRoute ? "admin-app-shell" : "app-shell"}>
      {!isAdminRoute && (
        <>
          {/* Date Bar */}
          <div className="date-bar">
            <div className="date-bar-left">{formattedDate}</div>
            <div className="date-bar-right">Est. Online • Digital Edition</div>
          </div>

          {/* Refined Header */}
          <header className="top-bar">
            <div className="masthead">
              <Link to="/" className="brand-link">
                <div>
                  <h1 className="brand">FAD</h1>
                  <p className="tagline">Trust Benchmark for Verified Thrift Stores</p>
                </div>
              </Link>
              <nav className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/discover">Discover</Link>
                <Link to="/dashboard" onClick={handleSellerDeskClick}>Seller Desk</Link>
              </nav>
            </div>
          </header>
        </>
      )}

      <main className={isAdminRoute ? "" : "page-container"}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<EntryPage />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/vendor/:id" element={<VendorProfile />} />
          <Route path="/review/:id" element={<SubmitReview />} />
          <Route path="/report" element={<ReportStore />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/onboarding" element={<SellerOnboarding />} />

          {/* Seller Dashboard */}
          <Route path="/dashboard" element={<SellerDashboard />}>
            <Route index element={<SellerDashboardHome />} />
            <Route path="seller/inbox" element={<ComplaintInbox />} />
            <Route path="seller/tips" element={<VerificationTips />} />
            <Route path="seller/marketplace-preview" element={<MarketplacePreview />} />
            <Route path="seller/promote" element={<PromoteStore />} />
            <Route path="seller/plan" element={<VerifiedPlan />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="certificates" element={<CertificatesPage />} />
            <Route path="analytics" element={<SellerAnalyticsPage />} />
            <Route path="complaints" element={<ComplaintsPage />} />
            <Route path="subscriptions" element={<SubscriptionsPage />} />
            {/* Placeholders for links in sidebar that don't have pages yet */}
            <Route path="verification" element={<VendorVerification />} />
            <Route path="marketplace" element={<MarketplaceListings />} />
            <Route path="reviews" element={<ReviewModeration />} />
          </Route>
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  )
}

export default App
