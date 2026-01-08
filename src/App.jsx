import { useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import EntryPage from './pages/EntryPage.jsx'
import Discover from './pages/Discover.jsx'
import VendorProfile from './pages/VendorProfile.jsx'
import SubmitReview from './pages/SubmitReview.jsx'
import ReportStore from './pages/ReportStore.jsx'
import SellerDashboard from './pages/SellerDashboard.jsx'
import SellerOnboarding from './pages/SellerOnboarding.jsx'
import AuthModal from './components/AuthModal.jsx'
import './App.css'

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false)

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
    <div className="app-shell">
      {/* Date Bar */}
      <div className="date-bar">
        <div className="date-bar-left">{formattedDate}</div>
        <div className="date-bar-right">Est. Online • Digital Edition</div>
      </div>

      {/* Refined Header */}
      <header className="top-bar">
        <div className="masthead">
          <div>
            <h1 className="brand">FAD</h1>
            <p className="tagline">Trust Benchmark for Verified Thrift Stores</p>
          </div>
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/discover">Discover</Link>
            <Link to="/dashboard" onClick={handleSellerDeskClick}>Seller Desk</Link>
          </nav>
        </div>
      </header>

      <main className="page-container">
        <Routes>
          <Route path="/" element={<EntryPage />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/vendor/:id" element={<VendorProfile />} />
          <Route path="/review/:id" element={<SubmitReview />} />
          <Route path="/report" element={<ReportStore />} />
          <Route path="/onboarding" element={<SellerOnboarding />} />
          <Route path="/dashboard" element={<SellerDashboard />} />
        </Routes>
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  )
}

export default App
