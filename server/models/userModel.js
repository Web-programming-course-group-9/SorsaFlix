import { pool } from "../db/index.js"


//This file is for user database functions used by the authentication process
//Routes login, register, logout , userdelete etc

//Find user by email or by username
export const finUserByEmailOrUsername = async (email, username) => {
    const result = await pool.query(
        'SELECT id FROM users WHERE email = $1 OR username = $2',
        [email, username]
    )
    return result.rows[0]
}

//Function to add user into database with /register
export const insertUser = async (username, email, passwordHash) => {
    const result = await pool.query(
        'INSERT INTO users (username,email, passwordHash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
        [username, email, passwordHash]
    )
    return result.rows[0]
}

//Find user by email from database
export const findUserByEmail = async (email) => {
    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    )
    return result.rows[0]
}

//delete user by id from database
export const deleteUserById = async (userId) => {
    const result = await pool.query(
        'DELETE FROM users WHERE id = $1',
        [userId]
    )
    return result.rowCount
}