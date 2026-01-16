import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, Instagram, Image } from 'lucide-react'
import { vendors as mockVendors } from '../data/vendors'
import { fetchVendorById } from '../lib/supabaseData'
import { reviewsService } from '../services/reviewsService'
import StarRating from '../components/StarRating'
import './VendorProfile.css'

function VendorProfile() {
  const { id } = useParams()
  const [vendor, setVendor] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadVendor() {
      setLoading(true)
      try {
        const dbVendor = await fetchVendorById(id)

        if (dbVendor) {
          // Image Fallback Logic
          let imageUrl = dbVendor.image_url;
          if (!imageUrl || imageUrl.includes('your-project-url.supabase.co')) {
            // Try to find matching mock vendor to get local image
            const mockMatch = mockVendors.find(mv => mv.username === dbVendor.instagram_handle);
            if (mockMatch) {
              imageUrl = mockMatch.image;
            } else {
              imageUrl = `/vendor-images/${dbVendor.instagram_handle}.png`;
            }
          }

          // Map DB fields to UI structure
          setVendor({
            id: dbVendor.id,
            name: dbVendor.business_name || dbVendor.store_name,
            username: dbVendor.instagram_handle,
            image: imageUrl,
            instagramUrl: `https://instagram.com/${dbVendor.instagram_handle}`,
            verified: dbVendor.verification_status === 'verified',
            description: dbVendor.description || 'No description provided.',
            rating: dbVendor.drip_score || 0,
            totalReviews: dbVendor.total_reviews || 0,

            // Construct rich data objects from available info or defaults
            dripScore: {
              total: (dbVendor.drip_score || 0) * 20, // Convert 5-star to 100-scale
              metrics: [
                { label: 'On-time delivery', value: 92 }, // Placeholder
                { label: 'Complaint rate (low is better)', value: 5, invert: true },
                { label: 'Refund behaviour', value: 88 },
                { label: 'Customer satisfaction', value: 95 },
              ],
            },
            verification: {
              status: dbVendor.verification_status === 'verified'
                ? 'KYC verified • Business documentation on file'
                : 'Pending Verification',
              lastChecked: 'Recently',
            },
            transparency: {
              deliveryTime: '3–5 business days', // Placeholder
              refundPolicy: 'Standard return policy applies',
              responseTime: 'Within 24 hours',
              shipping: 'Tracked shipping',
            }
          })
        } else {
          // Fallback for non-DB IDs (if any links rely on mock string IDs)
          const mock = mockVendors.find(v => v.id === id)
          if (mock) {
            setVendor({
              ...mock,
              dripScore: { total: 80, metrics: [] }, // minimal defaults
              verification: { status: 'Mock Data', lastChecked: 'N/A' },
              transparency: { deliveryTime: 'N/A', refundPolicy: 'N/A', responseTime: 'N/A', shipping: 'N/A' }
            })
          }
        }
      } catch (err) {
        console.error("Error loading vendor:", err)
      } finally {
        setLoading(false)
      }
    }


    async function loadReviews() {
      try {
        const data = await reviewsService.getVendorReviews(id);
        setReviews(data);
      } catch (err) {
        console.error("Error loading reviews", err);
      }
    }

    loadVendor();
    loadReviews();
  }, [id])

  if (loading) {
    return (
      <section className="page vendor-profile" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div>Loading vendor profile...</div>
      </section>
    )
  }

  if (!vendor) {
    return (
      <section className="page vendor-profile" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div>Vendor not found.</div>
      </section>
    )
  }

  return (
    <section className="page vendor-profile">
      <div className="vendor-hero">
        <div className="vendor-identity">
          <div
            className="vendor-hero-image"
            style={{ backgroundImage: vendor.image ? `url(${vendor.image})` : 'none' }}
          >
            {!vendor.image && <Image size={48} strokeWidth={1.5} style={{ opacity: 0.3 }} />}
          </div>
          <div className="vendor-identity-body">
            <div className="vendor-title-row">
              {vendor.name}
              {vendor.verified && (
                <span className="badge-verified">
                  <CheckCircle size={12} strokeWidth={2.5} />
                  Verified
                </span>
              )}
            </div>
            <a className="vendor-instagram" href={vendor.instagramUrl} target="_blank" rel="noreferrer">
              <Instagram size={14} style={{ marginRight: '4px', display: 'inline' }} />
              {vendor.username}
            </a>
            <p className="vendor-description">{vendor.description}</p>
            <div className="vendor-metrics">
              <StarRating rating={vendor.rating} />
              <span className="muted">{vendor.totalReviews} reviews</span>
              <span className="muted">ID: {id.slice(0, 8)}...</span>
            </div>
            <Link to={`/review/${id}`} style={{ textDecoration: 'none', marginTop: '0.75rem', display: 'inline-block' }}>
              <button className="submit-review-btn">
                Submit Review
              </button>
            </Link>
          </div>
        </div>

        <div className="drip-card">
          <div className="drip-card-header">
            <span className="drip-label">DripScore</span>
            <StarRating rating={vendor.dripScore.total / 20} />
          </div>
          <div className="drip-meter">
            {vendor.dripScore.metrics.map((metric) => {
              const value = metric.invert ? 100 - metric.value : metric.value
              return (
                <div key={metric.label} className="drip-meter-row">
                  <div className="drip-meter-label">
                    <span>{metric.label}</span>
                    <span className="drip-meter-value">{metric.value}%</span>
                  </div>
                  <div className="drip-meter-bar">
                    <span style={{ width: `${value}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="vendor-sections">
        <article className="vendor-panel">
          <div className="panel-head">
            <h3>Verification status</h3>
            <span className="pill success">Verified</span>
          </div>
          <p className="panel-text">{vendor.verification.status}</p>
          <p className="panel-subtext">Last checked: {vendor.verification.lastChecked}</p>
          <div className="panel-note">
            <span role="img" aria-label="shield">
              🛡️
            </span>
            Verified vendors provide ID, proof of address, and business documentation.
          </div>
        </article>

        <article className="vendor-panel">
          <div className="panel-head">
            <h3>Transparency data</h3>
            <span className="pill neutral">Shared by seller</span>
          </div>
          <dl className="transparency-grid">
            <div>
              <dt>Delivery time</dt>
              <dd>{vendor.transparency.deliveryTime}</dd>
            </div>
            <div>
              <dt>Refund / returns</dt>
              <dd>{vendor.transparency.refundPolicy}</dd>
            </div>
            <div>
              <dt>Response time</dt>
              <dd>{vendor.transparency.responseTime}</dd>
            </div>
            <div>
              <dt>Shipping method</dt>
              <dd>{vendor.transparency.shipping}</dd>
            </div>
          </dl>
        </article>
      </div>

      <section className="vendor-panel review-panel">
        <div className="panel-head">
          <h3>Verified customer reviews</h3>
          <span className="pill muted">{reviews.length} Reviews</span>
        </div>
        <div className="review-list">
          {reviews.length === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review) => {
              if (review.status === 'removed') {
                return (
                  <article key={review.id} className="review-card review-removed" style={{ opacity: 0.6, background: '#f9f9f9', borderStyle: 'dashed' }}>
                    <div className="review-top">
                      <span style={{ fontSize: '0.85rem', color: '#999', fontStyle: 'italic' }}>
                        Review removed by moderator
                      </span>
                    </div>
                  </article>
                )
              }
              return (
                <article key={review.id} className="review-card">
                  <div className="review-top">
                    <div>
                      <h4>{review.reviewer_name || 'Anonymous'}</h4>
                      <div className="review-meta">
                        <StarRating rating={review.rating} />
                        <span className="muted">{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {/* Tags or other metadata could go here */}
                  </div>
                  <p className="review-body">{review.review_text}</p>
                </article>
              )
            })
          )}
        </div>
      </section>
    </section>
  )
}

export default VendorProfile
