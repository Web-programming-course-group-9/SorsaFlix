import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { finUserByEmailOrUsername, insertUser, findUserByEmail, deleteUserById } from "../models/userModel.js"
import { insertRefreshToken,findRefreshTokenByHash, deleteRefreshTokenById, deleteRefreshTokenByHash } from "../models/refreshTokenModel.js"


//Refresh and access token expiration settings
const ACCESS_TOKEN_EXPIRES_IN = "15m"
const REFRESH_TOKEN_EXPIRES_IN_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

//Function for creating token hash. Tokens are not stored as is they are always stored in their hashed form
const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex")

//This function generates the token for refresh token use
const generateRefreshToken = () => {
    const token = crypto.randomBytes(64).toString("hex")//Random token
    return { token, tokenHash: hashToken(token)}
}

//Setting the cookie settings for login and refresh
const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production", //not really needed in this project
    sameSite: "strict",
    path: "auth",
    maxAge: REFRESH_TOKEN_EXPIRES_IN_MS
}

//Generates the access token to be stored in memory
const createAccessToken = (userId, username) =>
    jwt.sign({ id: userId, username}, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN})

//User registration logic
export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" })
        }

        const passwordRules = /^(?=.*[A-Z])(?=.*\d).{8,}$/
        if (!passwordRules.test(password)) {
            return res.status(400).json({
                error: "Password must be at least 8 characters long and contain at least one uppercase letter and one number"
            })
        }


        const existing = await findUserByEmailOrUsername(email, username)
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: "Email or username is already in use" })
        }

        //Hashes the password
        const passwordHash = await bcrypt.hash(password, 10)
        //Inserts the user into the database with username, email and hashed password
        const newUser = await insertUser( username, email, passwordHash)
        //returns the user details
        res.status(201).json(newUser)
    } catch (error) {
        next(error)
    }
}

//User login logic
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" })
        }
        //Find the user in database using email address
        const result = await findUserByEmail(email)
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" })
        }

        const passwordMatches = await bcrypt.compare(password, user.password_hash)
        if (!passwordMatches) {
            return res.status(401).json({ error: "Invalid email or password" })
        }
        //Generate access token 
        const accessToken = createAccessToken(user.id, user.username)

        //Generate refresh token
        const { token: refreshToken, tokenHash } = generateRefreshToken()
        const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN_MS)
        
        //Insert the refresh token into db
        await insertRefreshToken(user.id, tokenHash, expiresAt)
        

        //save token into a cookie, uses the options set above in cookie options
        res.cookie("refreshToken", refreshToken, refreshCookieOptions)

        res.status(200).json({
            token: accessToken,
            user: { id: user.id, username: user.username, email: user.email }
        })

    } catch (error) {
        next(error)
    }
}

//Refresh logic for session refreshes = refresh cookie refresh
export const refresh = async (req,res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.status(401).json({ error: "No refresh token provided"})
        }

        //Find the token in database
        const storedToken = await findRefreshTokenByHash(hashToken(refreshToken))
        //If the token has expired return a error
        if (!storedToken || storedToken.expires_at < new Date()) {
            return res.status(401).json({ error: "Invalid or expired refresh token"})
        }

        //The old token is single use so delete the old one and issue a new one
        await deleteRefreshTokenByHash(storedToken.id)

        const { token: newRefreshToken, tokenHash: newTokenHash } = generateRefreshToken()
        const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN_MS)
        await insertRefreshToken(storedToken.user_id, newTokenHash, expiresAt)
           
        
        res.cookie("refreshToken", newRefreshToken, refreshCookieOptions)

        //Refresh returns user details for the session to remain logged in
        res.status(200).json({
            token: createAccessToken(storedToken.user_id, storedToken.username),
            user: {id: storedToken.user_id, username: storedToken.username, email: storedToken.email} 
        })

    } catch (error) {
        next(error)
    }
}


//Logout logic deletes refresh token 
export const logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if (refreshToken) {
            await deleteRefreshTokenByHash(tokenHash)
        }

        res.clearCookie("refreshToken", { path: "/auth" })
        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

export const deleteAccount = async (req, res, next) => {
    try {
        // Delete user; CASCADE will handle related data in other tables if set up
        const deletedCount = await deleteUserById(req.user.id)

        // no row deleted = user was not found
        if (deletedCount === 0) {
            return res.status(404).json({ error: "User not found" })
        }

        res.status(200).json({ message: "Account deleted successfully" })
    } catch (error) {
        next(error)
    }
})


