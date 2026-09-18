import { Router } from "express"
import axios from "axios"
import "dotenv/config"

const router = Router()
//GET series  popular

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
          page: 1,
        },
      }
    )

    res.status(200).json(response.data.results)
  } catch (error) {
    next(error)
  }
})

//GET series top-rated
router.get("/top-rated", async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1

    const response = await axios.get(
      "https://api.themoviedb.org/3/tv/top-rated",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`
        },
        params: {
          language: "fi-FI",
          page: 1,
        },
      }
    )

    res.status(200).json(response.data.results)
  } catch (error) {
    next(error)
  }
})
//GET series coming today 
router.get("/airing-today", async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1

    const response = await axios.get(
      "https://api.themoviedb.org/3/tv/airing-today",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`
        },
        params: {
          language: "fi-FI",
          page: 1,
        },
      }
    )

    res.status(200).json(response.data.results)
  } catch (error) {
    next(error)
  }
})
// GET series on tv at moment
router.get("/on-the-air", async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1
    
    const response = await axios.get(
      "https://api.themoviedb.org/3/tv/on-the-air",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`
        },
        params: {
          language: "fi-FI",
          page: 1,
        },
      }
    )

    res.status(200).json(response.data.results)
  } catch (error) {
    next(error)
  }
})
export default router