import { pool } from "../db/index.js"

export async function createReview(
  movieId,
  userId,
  reviewText,
  stars
) {
  const result = await pool.query(
    `
      INSERT INTO reviews (
        user_id,
        movie_id,
        review_text,
        stars
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
    [userId, movieId, reviewText, stars]
  )

  return result.rows[0]
}

export async function getReviewsByMovie(movieId) {
  const result = await pool.query(
    `
      SELECT
        reviews.id,
        reviews.movie_id,
        reviews.review_text,
        reviews.stars,
        reviews.created_at,
        users.username
      FROM reviews
      JOIN users
        ON reviews.user_id = users.id
      WHERE reviews.movie_id = $1
      ORDER BY reviews.created_at DESC
    `,
    [movieId]
  )

  return result.rows
}

export async function getReviewById(id) {
  const result = await pool.query(
    `
      SELECT
        reviews.id,
        reviews.movie_id,
        reviews.user_id,
        reviews.review_text,
        reviews.stars,
        reviews.created_at,
        users.username
      FROM reviews
      JOIN users
        ON reviews.user_id = users.id
      WHERE reviews.id = $1
    `,
    [id]
  )

  return result.rows[0]
}

export async function deleteReview(id, userId) {
  const result = await pool.query(
    `
      DELETE FROM reviews
      WHERE id = $1
      AND user_id = $2
      RETURNING *
    `,
    [id, userId]
  )

  return result.rows[0]
}