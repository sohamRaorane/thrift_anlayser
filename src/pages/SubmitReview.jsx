
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Upload, Image, Instagram } from 'lucide-react'
import { reviewQuestions } from '../data/reviewQuestions'
import { vendors } from '../data/vendors'
import StarRating from '../components/StarRating'
import './SubmitReview.css'

function SubmitReview() {
  const navigate = useNavigate()
  const { id } = useParams()
  const vendor = vendors.find(v => v.id === id)

  const [overallRating, setOverallRating] = useState(0)
  const [detailRatings, setDetailRatings] = useState(
    reviewQuestions.reduce((acc, q) => ({ ...acc, [q.id]: 0 }), {})
  )
  const [experience, setExperience] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState([])

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    setUploadedFiles(prev => [...prev, ...files])
  }

  if (!vendor) {
    return (
      <section className="page submit-review">
        <p>Vendor not found</p>
      </section>
    )
  }

  const renderStarRating = (currentValue, onChange) => (
    <div className="star-rating-input">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          className={value <= currentValue ? 'star-btn active' : 'star-btn'}
          onClick={() => onChange(value)}
          aria-label={`Rate ${value} stars`}
        >
          ★
        </button>
      ))}
    </div>
  )

  return (
    <section className="page submit-review">
      <header className="submit-review__header">
        <div className="breadcrumb" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} className="chevron" strokeWidth={2} />
          <span>Back</span>
        </div>
        <h1>Submit Review</h1>
      </header>

      <div className="review-shell">
        {/* Top: Vendor Photo + Description in Row */}
        <div className="vendor-info-row">
          <div className="vendor-image-placeholder" aria-hidden="true">
            {vendor.image ? (
              <img
                src={vendor.image}
                alt={vendor.name}
                style={{ width: '100%', height: '100%', maxWidth: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
              />
            ) : (
              <Image size={48} strokeWidth={1.5} />
            )}
          </div>
          <div className="vendor-meta">
            <div>
              <p className="label">Vendor</p>
              <h2 className="vendor-name">{vendor.name}</h2>
              <a href={vendor.instagramUrl} target="_blank" rel="noopener noreferrer" className="instagram-link">
                <Instagram size={16} strokeWidth={2} />
                @{vendor.username}
              </a>
              <p className="vendor-description" style={{ marginTop: 'var(--space-2)', color: 'var(--text-secondary)' }}>
                {vendor.description}
              </p>
            </div>
            <div className="vendor-score">
              <span className="label">Current score</span>
              <div className="score-display">
                <StarRating rating={vendor.score} />
                <span className="score-numeric">{vendor.score}/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Upload Left + Review Form Right */}
        <div className="review-content">
          <div className="upload-section">
            <label className="upload-box" htmlFor="file-upload">
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <div className="upload-icon">
                <Upload size={20} strokeWidth={2} />
              </div>
              <p>Upload invoice or product images</p>
              {uploadedFiles.length > 0 && (
                <span className="file-count">{uploadedFiles.length} file(s) selected</span>
              )}
            </label>
          </div>

          <div className="review-form">
            <div className="form-row">
              <div>
                <p className="label">Overall rating</p>
                {renderStarRating(overallRating, setOverallRating)}
              </div>
            </div>

            <label className="form-row" htmlFor="experience">
              <p className="label">Experience details</p>
              <textarea
                id="experience"
                className="review-textarea"
                placeholder="Write a detailed review (order experience, delivery, quality, customer service)"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                rows={5}
              />
            </label>

            <div className="detail-questions">
              {reviewQuestions.map((question) => (
                <div className="question-row" key={question.id}>
                  <span>{question.label}</span>
                  {renderStarRating(detailRatings[question.id], (value) =>
                    setDetailRatings((prev) => ({ ...prev, [question.id]: value }))
                  )}
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button type="button" className="primary-btn">
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SubmitReview
