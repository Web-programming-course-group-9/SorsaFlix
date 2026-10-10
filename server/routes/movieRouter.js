import { Router } from "express"
import axios from "axios"
import "dotenv/config"
import { fetchMovieById } from "../controller/movieController.js"

const router = Router()

// GET /moives/now-playing
// Fetches movies that are currently playing in theaters from the TMDB API and returns the data as JSON.
router.get("/now-playing", async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1

        const response = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
            },
            params: {
                region: "FI",
                language: "fi-FI",
                page,
            },
        })
    // send TMDB movie list back to the client as JSON
    res.status(200).json(response.data.results)
    } catch (error) {
        next(error)
    }
})

router.get("/popular", async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1

    const response = await axios.get(
      "https://api.themoviedb.org/3/movie/popular",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
        },
        params: {
          language: "fi-FI",
          region: "FI",
          page,
        },
      }
    )

    res.status(200).json(response.data.results);
  } catch (error) {
    next(error)
  }
})

router.get("/upcoming", async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1

    const response = await axios.get(
      "https://api.themoviedb.org/3/movie/upcoming",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
        },
        params: {
          language: "fi-FI",
          region: "FI",
          page,
        },
      }
    )

    res.status(200).json(response.data.results);
  } catch (error) {
    next(error)
  }
})

router.get("/top-rated", async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1

    const response = await axios.get(
      "https://api.themoviedb.org/3/movie/top_rated",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
        },
        params: {
          language: "fi-FI",
          region: "FI",
          page,
        },
      }
    )

    res.status(200).json(response.data.results);
  } catch (error) {
    next(error)
  }
})



// Earliest year that makes sense for a movie (first films were made around 1888)
const MIN_MOVIE_YEAR = 1888
// Allow a few years into the future because upcoming movies are announced early
const MAX_YEARS_AHEAD = 5

// GET /movies/search?query=...
// Searches TMDB for movies matching the given query string.
router.get("/search", async (req, res, next) => {
    const { query, year } = req.query
    const page = Number(req.query.page) || 1

    if (!query || !query.trim()) {
        return res.status(400).json({ error: "Query parameter 'query' is required" })
    }
    //Validating that year input is valid number
    let validYear = undefined
    if (year !== undefined && year !== "") {
      if (typeof year !== "string" || !/^\d{4}$/.test(year)) {
        return res.status(400).json({ error: "Query parameter 'year' must be a 4-digit year"})
      }  
      validYear = Number(year)
      const maxYear = new Date().getFullYear() + MAX_YEARS_AHEAD

      if (validYear < MIN_MOVIE_YEAR || validYear > maxYear) {
        return res.status(400).json({
            error: `Query parameter 'year' must be between ${MIN_MOVIE_YEAR} and ${maxYear}`
        })
      }
    }


    try {
        const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
            },
            params: {
                query,
                page,
                region: "FI",
                language: "fi-FI",
                primary_release_year: validYear,
            }
        })
        res.status(200).json(response.data.results)
    } catch (error) {
        next(error)
    }
})

router.get("/by-genre", async (req, res, next) => {
  try {
    const genre = Number(req.query.genre)
    const page = Number(req.query.page) || 1

    if (!genre) {
      return res.status(400).json({
        error: "Genre is required"
      })
    }

    const response = await axios.get(
      "https://api.themoviedb.org/3/discover/movie",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
        },
        params: {
          language: "fi-FI",
          region: "FI",
          with_genres: genre,
          page,
        },
      }
    )

    res.status(200).json({
      results: response.data.results,
      page: response.data.page,
      total_pages: response.data.total_pages,
    })
  } catch (error) {
    next(error)
  }
})

// GET /movies/:movieId
// Returns one movie's details by its TMDB id
router.get("/:movieId", fetchMovieById)

export default router