import {
  createReview,
  getReviewsByMovie,
  getReviewById,
  deleteReview
} from "../models/reviewModel.js"

export async function addReview(req, res, next) {
  try {
    const userId = req.user.id
    const { movieId, reviewText, stars } = req.body

    if (!movieId || !reviewText || !stars) {
      return res.status(400).json({
        error: "Movie, review text and stars are required"
      })
    }

    if (stars < 1 || stars > 10) {
      return res.status(400).json({
        error: "Stars must be between 1 and 10"
      })
    }

    const review = await createReview(
      movieId,
      userId,
      reviewText,
      stars
    )

    res.status(201).json(review)
  } catch (error) {
    next(error)
  }
}

export async function getMovieReviews(req, res, next) {
  try {
    const movieId = Number(req.params.movieId)

    const reviews = await getReviewsByMovie(movieId)

    res.status(200).json(reviews)
  } catch (error) {
    next(error)
  }
}

export async function getReview(req, res, next) {
  try {
    const id = Number(req.params.id)

    const review = await getReviewById(id)

    if (!review) {
      return res.status(404).json({
        error: "Review not found"
      })
    }

    res.status(200).json(review)
  } catch (error) {
    next(error)
  }
}

export async function removeReview(req, res, next) {
  try {
    const id = Number(req.params.id)
    const userId = req.user.id

    const review = await deleteReview(id, userId)

    if (!review) {
      return res.status(404).json({
        error: "Review not found"
      })
    }

    res.status(200).json({
      message: "Review deleted"
    })
  } catch (error) {
    next(error)
  }
}