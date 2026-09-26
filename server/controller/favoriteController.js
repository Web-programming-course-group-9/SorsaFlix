import { addMovieToFavorites, deleteMovieFromFavorites, getUserById, getFavoritesByUserId } from "../models/favoriteModel.js";

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

export async function removeFavorite(req, res, next) {
    try {
        const userId = req.user.id
        const movieId = Number(req.params.movieId)

        if (movieId < 1 || !Number.isInteger(movieId)) {
            return res.status(400).json({
                error: "Invalid movie ID"
            })
        }

        const favorite = await deleteMovieFromFavorites(movieId, userId)

        if (!favorite) {
            return res.status(404).json({
                error: "Movie not found in favorites"
            })
        }

        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
}

export async function getUserFavorites(req, res, next) {
    try {
        const userId = Number(req.params.userId)
        
        if (userId < 1 || !Number.isInteger(userId)) {
            return res.status(400).json({
                error: "Invalid user ID"
            })
        }
        const user = await getUserById(userId)

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            })
        }

        const favorites = await getFavoritesByUserId(userId)
        res.json({
            user: user,
            favorites: favorites
        })

    } catch (error) {
        next(error)
    }
}

