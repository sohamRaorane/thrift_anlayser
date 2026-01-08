import './StarRating.css'

function StarRating({ rating, maxStars = 5 }) {
    const stars = []

    for (let i = 1; i <= maxStars; i++) {
        if (i <= Math.floor(rating)) {
            // Full star
            stars.push(
                <span key={i} className="star star-full">★</span>
            )
        } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
            // Partial star
            const percentage = ((rating % 1) * 100).toFixed(0)
            stars.push(
                <span key={i} className="star star-partial" style={{ '--fill-percentage': `${percentage}%` }}>
                    <span className="star-bg">☆</span>
                    <span className="star-fill">★</span>
                </span>
            )
        } else {
            // Empty star
            stars.push(
                <span key={i} className="star star-empty">☆</span>
            )
        }
    }

    return <div className="star-rating">{stars}</div>
}

export default StarRating
