import { addMovieToFavorites } from "../models/favoriteModel.js";

export async function addFavorite(req, res, next) {
    try {
        const userId = req.user.id
        const movieId = Number(req.body.movieId)

        if (movieId < 1 || !Number.isInteger(movieId)) {
            return res.status(400).json({
                error: "Invalid movie ID"
            })
        }

        const favorite = await addMovieToFavorites(userId, movieId)

        res.status(201).json(favorite)
    } catch (error) {
        //PostgreSQL unique violation,prevents adding same movie twice to favorites
        if (error.code === '23505') {
            return res.status(409).json({
                error: "Movie is already in favorites"
            })
        }
        
        next(error)      
    }
}