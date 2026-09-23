import { useEffect, useState } from "react"
import axios from "axios"
import "./reviewList.css"

// Show all reviews for one movie
// Takes movieId as a prop
function ReviewList({ movieId }) {
    // reviews = list of reviews
    // loading = boolean to show loading state
    // error = message shown if request fails
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    
    // run fetch when component mounts, and again if moviedId changes
    useEffect(() => {
        async function fetchReviews() {
            try {
                // start loading
                setLoading(true)
                setError("")
                // fetch reviews from backend
                const response = await axios.get(`/reviews/movie/${movieId}`)
                // set reviews to response data
                setReviews(response.data)
            } catch (err) {
                // if request fails, show error message
                setError("Failed to load reviews")
            } finally {
                // stop loading
                setLoading(false)
            }
        }
        fetchReviews()
    }, [movieId])

    // while request runs show loading message
    if (loading) {
        return <p>Loading reviews...</p>
    }

    // if request fails show error message
    if (error) {
        return <p>{error}</p>
    }

    // if no reviews, show message
    if (reviews.length === 0) {
        return <p>No reviews yet</p>
    }
    
    // show list of reviews
    return (
        <div className="review-list">
            {/* map over reviews and show each one */}
            {reviews.map((review) => (
                
                <div key={review.id} className="review-item">

                    {/* Top row: username, date, rating side by side */}
                    <div className="review-header">
                        <span className="review-author">{review.username}</span>
                        <span className="review-date">
                        {new Date(review.created_at).toLocaleDateString("fi-FI")}
                        </span>
                        <span className="review-rating">Rating {review.stars}</span>
                    </div>

                    {/* The review text below the header */}
                    <p className="review-text">{review.review_text}</p>
                </div>
            ))}
        </div>
    )
}

export default ReviewList