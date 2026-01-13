import { Link } from 'react-router-dom'
import { Search, Flag, Plus, CheckCircle } from 'lucide-react'
import './EntryPage.css'

function EntryPage() {
  return (
    <section className="page entry-hero">
      <div className="hero-badge">
        <CheckCircle size={32} strokeWidth={2.5} />
      </div>
      <h1 className="hero-title">FAD</h1>
      <p className="hero-subtitle">Trust benchmark for verified thrift stores</p>

      <div className="divider" />

      <div className="action-grid">
        <Link to="/discover" style={{ textDecoration: 'none', color: 'inherit' }}>
          <article className="action-card">
            <div className="action-icon">
              <Search size={24} strokeWidth={2} />
            </div>
            <h3>Check verification</h3>
            <p>Confirm if a thrift store is FAD verified.</p>
          </article>
        </Link>

        <Link to="/report" style={{ textDecoration: 'none', color: 'inherit' }}>
          <article className="action-card">
            <div className="action-icon">
              <Flag size={24} strokeWidth={2} />
            </div>
            <h3>Report a store</h3>
            <p>Flag suspicious activity so we can review it.</p>
          </article>
        </Link>

        <Link to="/onboarding" style={{ textDecoration: 'none', color: 'inherit' }}>
          <article className="action-card">
            <div className="action-icon">
              <Plus size={24} strokeWidth={2} />
            </div>
            <h3>Get listed with FAD</h3>
            <p>Start onboarding to become a verified seller.</p>
          </article>
        </Link>
      </div>


      <div className="admin-access-footer" style={{ marginTop: '40px', textAlign: 'center' }}>
        <Link to="/admin" style={{ color: '#aaa', fontSize: '12px', textDecoration: 'none', borderBottom: '1px dashed #aaa' }}>
          Admin Portal Access
        </Link>
      </div>
    </section >
  )
}

export default EntryPage

