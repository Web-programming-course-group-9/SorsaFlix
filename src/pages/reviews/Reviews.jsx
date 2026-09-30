import { useEffect, useState } from "react"
import axios from "axios"
import MovieCard from "../../components/MovieCard"
import "./Reviews.css"

function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true)
        setError("")

        const response = await axios.get("/reviews")

        const reviewsWithMovies = await Promise.all(
          response.data.map(async review => {
            const movieResponse = await axios.get(
              `/movies/${review.movie_id}`
            )

            return {
              ...review,
              movie: movieResponse.data
            }
          })
        )

        setReviews(reviewsWithMovies)
      } catch (error) {
        console.error(error)
        setError("Failed to load reviews.")
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  if (loading) {
    return (
      <main className="reviews-page">
        <h1>Reviews</h1>
        <p>Loading reviews...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="reviews-page">
        <h1>Reviews</h1>
        <p>{error}</p>
      </main>
    )
  }

  return (
    <main className="reviews-page">
      <h1>Reviews</h1>

      {reviews.length === 0 ? (
        <p className="no-reviews">
          No reviews yet.
        </p>
      ) : (
        <div className="reviews-list">
          {reviews.map(review => (
            <article
              className="review-card"
              key={review.id}
            >
              <MovieCard movie={review.movie} />

              <div className="review-content">
                <div className="review-header">
                  <h2>{review.username}</h2>

                  <span className="review-stars">
                    {"⭐".repeat(review.stars)}
                  </span>
                </div>

                <p className="review-text">
                  {review.review_text}
                </p>

                <div className="review-meta">
                  {new Date(review.created_at).toLocaleDateString()}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

export default Reviews