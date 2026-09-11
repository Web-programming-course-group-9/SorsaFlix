import { Router } from "express";
import axios from "axios";
import "dotenv/config";

const router = Router();

// GET /moives/now-playing
// Fetches movies that are currently playing in theaters from the TMDB API and returns the data as JSON.
router.get("/now-playing", async (req, res, next) => {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
            },
            params: {
                region: "FI",
                language: "fi-FI",
            },
        });
    // send TMDB movie list back to the client as JSON
    res.status(200).json(response.data.results);
    } catch (error) {
        next(error);
    }
});

//GET /movies/search?query=matrix
//Searches movies by title
router.get("/search", async (req,res,next) => {
    try {
        const { query } = req.query
        if (!query) {
            //TMDB search endpoint requires a query parameter
            return res.status(400).json({ error: "Query parameter 'query' is required"})
        }
        const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
            },
            params: {
                query,
                region: "FI",
                language: "fi-FI",
            }
        })
        res.status(200).json(response.data.results)
    } catch (error) {
        next(error)
    }
})


export default router;