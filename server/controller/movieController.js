import { getMovieById } from "../models/movieModel.js"

// Reads input from request, calls the model, send the result back
export async function fetchMovieById(req, res, next) {
    try {
        // gradb id from the URL
        const { movieId } = req.params

        // ask model for data
        const movie = await getMovieById(movieId)
        
        // send it to the client as JSON
        res.status(200).json(movie)
    } catch (error) {
        next(error)
    }
}