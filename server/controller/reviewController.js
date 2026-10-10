import {
  createReview,
  getReviewsByMovie,
  getReviewById,
  deleteReview,
  getAllReviews
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

    if (stars < 1 || stars > 5) {
      return res.status(400).json({
        error: "Stars must be between 1 and 5"
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

    // movie id must be a positive integer
    if (movieId <1 || !Number.isInteger(movieId)) {
      return res.status(400).json({
        error: "Invalid movie ID"
      })
    }

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
export async function getAllMovieReviews(req, res, next) {
  try {
    const reviews = await getAllReviews()

    const reviewsWithMovies = await Promise.all(
      reviews.map(async review => {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${review.movie_id}?api_key=${process.env.TMDB_API_KEY}`
        )

        const movie = await response.json()

        return {
          ...review,
          movie: {
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            vote_average: movie.vote_average
          }
        }
      })
    )

    res.status(200).json(reviewsWithMovies)
  } catch (error) {
    next(error)
  }
}