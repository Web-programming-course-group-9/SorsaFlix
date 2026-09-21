import { Router } from "express"
import axios from "axios"
import "dotenv/config"

const router = Router()

// GET series popular
router.get("/popular", async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1

    const response = await axios.get(
      "https://api.themoviedb.org/3/tv/popular",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`
        },
        params: {
          language: "fi-FI",
          page,
        },
      }
    )

    res.status(200).json(response.data.results)
  } catch (error) {
    next(error)
  }
})

// GET series top-rated
router.get("/top-rated", async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1

    const response = await axios.get(
      "https://api.themoviedb.org/3/tv/top_rated",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`
        },
        params: {
          language: "fi-FI",
          page,
        },
      }
    )

    res.status(200).json(response.data.results)
  } catch (error) {
    next(error)
  }
})

// GET series airing today
router.get("/airing-today", async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1

    const response = await axios.get(
      "https://api.themoviedb.org/3/tv/airing_today",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`
        },
        params: {
          region: "FI",
          language: "fi-FI",
          page,
        },
      }
    )

    res.status(200).json(response.data.results)
  } catch (error) {
    next(error)
  }
})

// GET series on the air
router.get("/on-the-air", async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1

    const response = await axios.get(
      "https://api.themoviedb.org/3/tv/on_the_air",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`
        },
        params: {
          region: "FI",
          language: "fi-FI",
          page,
        },
      }
    )

    res.status(200).json(response.data.results)
  } catch (error) {
    next(error)
  }
})

// Get seriesby search query
router.get("/search", async (req, res, next) => {
    const { query, year } = req.query
    const page = Number(req.query.page) || 1

    if (!query || !query.trim()) {
      return res.status(400).json({ error: "Query parameter 'query' is required" })
    }

    try {
      const response = await axios.get('https://api.themoviedb.org/3/search/tv', {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`
        },
        params: {
          query,
          language: "fi-FI",
          first_air_date_year: year || undefined,
          page,
        },
      })

      res.status(200).json(response.data.results)
    } catch (error) {
      next(error)
    }
  })

export default router