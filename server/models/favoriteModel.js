import { pool } from '../db/index.js'


export async function addMovieToFavorites(userId, movieId) {
    const result = await pool.query(
        'INSERT INTO favorites (user_id, movie_id) VALUES($1, $2) RETURNING *',
        [userId, movieId]
    )
    return result.rows[0]
}

export async function deleteMovieFromFavorites(movieId, userId) {
    const result = await pool.query(
        'DELETE FROM favorites WHERE movie_id = $1 AND user_id = $2 RETURNING *',
        [movieId, userId]
    )
    return result.rows[0]
}