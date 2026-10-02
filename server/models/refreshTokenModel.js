import { pool } from "../db/index.js"


//This file exports the refresh token db functions tobe used in user authentication

//Function to add refresh tokens to database
export const insertRefreshToken = async (userId, tokenHash, expiresAt) => {
    await pool.query(
        'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
        [userId, tokenHash, expiresAt]
    )
}

//Finds a stored token together with the users email and username
export const findRefreshTokenByHash = async (tokenHash) => {
    const result = await pool.query(
        'SELECT rt.*, u.username, u.email FROM refresh_tokens rt JOIN users u ON u.id = rt.user_id WHERE rt.token_hash = $1',
        [tokenHash]
    )
    return result.rows[0]
}

//Function that deletes the token by id
export const deleteRefreshTokenById = async (id) => {
    await pool.query(
        'DELETE FROM refresh_tokens WHERE id = $1',
        [id]
    )
}


//Function that deletes token by hash
export const deleteRefreshTokenByHash = async (tokenHash) => {
    await pool.query(
        'DELETE FROM refresh_tokens WHERE token_hash = $1',
        [tokenHash]
    )
}
