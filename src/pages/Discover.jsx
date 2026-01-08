import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, SlidersHorizontal, Instagram } from 'lucide-react'
import { fetchVendors } from '../lib/supabaseData'
import { vendors as mockVendors } from '../data/vendors'
import StarRating from '../components/StarRating'
import './Discover.css';

function Discover() {
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [selectedScore, setSelectedScore] = useState('All')
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVendors()
  }, [])

  async function loadVendors() {
    console.log('DEBUG: Starting loadVendors')
    setLoading(true)
    try {
      console.log('DEBUG: Forcing mock data use')
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))

      const mappedVendors = mockVendors // Use imports directly

      console.log('DEBUG: Setting vendors state:', mappedVendors)
      if (mappedVendors && mappedVendors.length > 0) {
        setVendors(mappedVendors)
      } else {
        console.error('DEBUG: Mock vendors empty!')
      }

    } catch (error) {
      console.error('CRITICAL ERROR in loadVendors:', error)
      setVendors(mockVendors)
    } finally {
      console.log('DEBUG: Loading finished')
      setLoading(false)
    }
  }

  const categories = useMemo(
    () => ['All', ...new Set(vendors.map((v) => v.category))],
    [vendors],
  )
  const locations = useMemo(
    () => ['All', ...new Set(vendors.map((v) => v.location))],
    [vendors],
  )
  const scores = ['All', '5', '4']

  const filtered = useMemo(() => {
    return vendors.filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.username.toLowerCase().includes(search.toLowerCase())

      const matchesCategory =
        selectedCategory === 'All' || v.category === selectedCategory
      const matchesLocation =
        selectedLocation === 'All' || v.location === selectedLocation
      const matchesScore =
        selectedScore === 'All' || String(v.score) === selectedScore

      return matchesSearch && matchesCategory && matchesLocation && matchesScore
    })
  }, [vendors, search, selectedCategory, selectedLocation, selectedScore])

  const trending = useMemo(
    () => [...vendors].sort((a, b) => b.score - a.score),
    [vendors],
  )

  return (
    <section className="page discover-shell">
      <div className="app-bar">
        <div className="app-bar-left">Discover</div>
      </div>

      <div className="discover-grid">
        <aside className="trending-pane">
          <div className="trending-header">🔥 Trending this week</div>
          <div className="trending-list" role="list">
            {trending.map((v, idx) => (
              <Link key={v.username} to={`/vendor/${v.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <article className="trending-card" role="listitem">
                  <div className="trend-rank">{idx + 1}.</div>
                  <div className="trend-main">
                    <div className="trend-name">{v.name}</div>
                    <div className="trend-username">
                      <Instagram size={12} style={{ marginRight: '4px', display: 'inline' }} />
                      {v.username}
                    </div>
                    <StarRating rating={v.score} />
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </aside>

        <div className="results-pane">
          <div className="search-row">
            <div className="search-bar">
              <Search size={18} className="search-icon" strokeWidth={2} />
              <input
                type="text"
                placeholder="Search a FAD verified vendor"
                aria-label="Search vendors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="filter-icon" onClick={() => setShowFilters(!showFilters)}>
                <SlidersHorizontal size={16} strokeWidth={2} style={{ marginRight: '6px' }} />
                Filters
              </button>
            </div>

            {showFilters && (
              <div className="filter-dropdown" role="menu">
                <div className="filter-group">
                  <div className="filter-label">Category</div>
                  <div className="chip-row">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className={`chip ${selectedCategory === cat ? 'chip-active' : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <div className="filter-label">Location</div>
                  <div className="chip-row">
                    {locations.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        className={`chip ${selectedLocation === loc ? 'chip-active' : ''}`}
                        onClick={() => setSelectedLocation(loc)}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <div className="filter-label">DripScore</div>
                  <div className="chip-row">
                    {scores.map((score) => (
                      <button
                        key={score}
                        type="button"
                        className={`chip ${selectedScore === score ? 'chip-active' : ''}`}
                        onClick={() => setSelectedScore(score)}
                      >
                        {score === 'All' ? 'All' : `${score}★`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="vendor-stack">
            {filtered.map((vendor) => (
              <Link key={vendor.username} to={`/vendor/${vendor.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <article className="vendor-card large">
                  <div className="vendor-thumb large" aria-hidden>
                    {vendor.image ? (
                      <img
                        src={vendor.image}
                        alt={vendor.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                      />
                    ) : (
                      '📷'
                    )}
                  </div>
                  <div className="vendor-body">
                    <div className="vendor-head">
                      <div>
                        <div className="vendor-name">
                          {vendor.name}
                          {vendor.verified && <span className="badge">✓ Verified</span>}
                        </div>
                        <div className="vendor-username">
                          <Instagram size={12} style={{ marginRight: '4px', display: 'inline' }} />
                          {vendor.username}
                        </div>
                      </div>
                      <StarRating rating={vendor.score} />
                    </div>
                    <div className="vendor-meta">
                      <span className="vendor-category">{vendor.category}</span>
                      <span className="meta-separator">•</span>
                      <span className="vendor-location">{vendor.location}</span>
                    </div>
                    <p className="vendor-description">{vendor.description}</p>
                  </div>
                </article>
              </Link>
            ))}

            {filtered.length === 0 && (
              <div className="empty-state">
                No vendors match that search or filter yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Discover
