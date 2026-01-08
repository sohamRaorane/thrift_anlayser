import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, Instagram, Image } from 'lucide-react'
import { vendors } from '../data/vendors'
import { mockReviews } from '../data/mockReviews'
import StarRating from '../components/StarRating'
import './VendorProfile.css'

function VendorProfile() {
  const { id } = useParams()
  const baseVendor = vendors.find(v => v.id === id)

  // Mock vendor + review data for the UI; replace with API data later.
  const vendor = useMemo(
    () => {
      const defaultVendor = {
        name: 'VINTAGE THREADS',
        username: 'vintagethreads.ldn',
        image: null,
        instagramUrl: 'https://instagram.com/vintagethreads.ldn',
        verified: true,
        description: 'Curated thrift drops, same-week dispatch, and responsive customer care for streetwear hunters.',
        rating: 4.8,
        totalReviews: 248,
        dripScore: {
          total: 92,
          metrics: [
            { label: 'On-time delivery', value: 94 },
            { label: 'Complaint rate (low is better)', value: 8, invert: true },
            { label: 'Refund behaviour', value: 90 },
            { label: 'Customer satisfaction', value: 93 },
          ],
        },
        verification: {
          status: 'KYC verified • Business documentation on file',
          lastChecked: '3 days ago',
        },
        transparency: {
          deliveryTime: '3–5 business days',
          refundPolicy: 'Free returns within 7 days; store credit after 14 days',
          responseTime: 'Avg. 2 hours on DMs',
          shipping: 'Tracked courier with proof of postage',
        },
      }

      if (baseVendor) {
        return { ...defaultVendor, ...baseVendor }
      }
      return defaultVendor
    },
    [baseVendor]
  )


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
              <span className="muted">ID: {id}</span>
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
          <span className="pill muted">Mock data</span>
        </div>
        <div className="review-list">
          {mockReviews.map((review) => (
            <article key={review.id} className="review-card">
              <div className="review-top">
                <div>
                  <h4>{review.title}</h4>
                  <div className="review-meta">
                    <StarRating rating={review.rating} />
                    <span className="muted">{review.author}</span>
                    <span className="muted">{review.date}</span>
                  </div>
                </div>
                <div className="tag-row">
                  {review.tags.map((tag) => (
                    <span key={tag} className="pill small">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="review-body">{review.body}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

export default VendorProfile
