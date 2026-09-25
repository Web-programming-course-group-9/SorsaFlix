import { useState } from "react"
import axios from "axios"
import { getAccessToken } from "../api/tokenStore.js"

function ReviewForm({ movieId }) {
  const [reviewText, setReviewText] = useState("")
  const [stars, setStars] = useState(5)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setLoading(true)
      setMessage("")

  const token = getAccessToken()



await axios.post(
  "/reviews",
  {
    movieId,
    reviewText,
    stars
  },
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
)
      setReviewText("")
      setStars(5)
      setMessage("Review added successfully.")
    } catch (error) {

  setMessage(
    error.response?.data?.error ||
    "Failed to add review."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      className="review-form"
      onSubmit={handleSubmit}
    >
      <h2>Write a review</h2>

      <label htmlFor="review-stars">
        Rating
      </label>

      <select
        id="review-stars"
        value={stars}
        onChange={event => setStars(Number(event.target.value))}
      >
        <option value={1}>1 star</option>
        <option value={2}>2 stars</option>
        <option value={3}>3 stars</option>
        <option value={4}>4 stars</option>
        <option value={5}>5 stars</option>
      </select>

      <label htmlFor="review-text">
        Review
      </label>

      <textarea
        id="review-text"
        value={reviewText}
        onChange={event => setReviewText(event.target.value)}
        placeholder="Write your review..."
        required
      />

      <button
        type="submit"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit review"}
      </button>

      {message && (
        <p>{message}</p>
      )}
    </form>
  )
}

export default ReviewForm