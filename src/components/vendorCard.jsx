
function VendorCard({ name, username, verified = false, dripScore = 0 }) {
  const score = Math.max(0, Math.min(5, Math.round(dripScore)))

  return (
    <article className="vendor-card" role="article">
      <div className="vendor-thumb" aria-hidden>
        📷
      </div>

      <div className="vendor-body">
        <div className="vendor-head">
          <div className="vendor-title">
            <div className="vendor-name">
              {name}
              {verified && <span className="badge">Verified</span>}
            </div>
            <div className="vendor-username">@{username}</div>
          </div>

          <div
            className="vendor-score"
            aria-label={`Drip score ${score} out of 5`}
          >
            <div className="score-label">Drip score</div>
            <div className="stars">
              {'★'.repeat(score)}
              {'☆'.repeat(5 - score)}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default VendorCard
