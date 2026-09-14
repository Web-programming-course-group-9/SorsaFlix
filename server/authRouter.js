import { Router } from "express"
import bcrypt from "bcrypt"
import { pool } from "./db/index.js"
import jwt from "jsonwebtoken"

const router = Router()

router.post("/register", async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Kaikki kentät vaaditaan" })
        }

        const passwordRules = /^(?=.*[A-Z])(?=.*\d).{8,}$/
        if (!passwordRules.test(password)) {
        return res.status(400).json({
        error: "Salasanan pitää olla vähintään 8 merkkiä ja sisältää vähintään yksi iso kirjain ja yksi numero"
        })
        }


        const existing = await pool.query("SELECT id FROM users WHERE email = $1 OR username = $2", [email, username])
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: "Sähköposti tai käyttäjänimi on jo käytössä" })
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const result = await pool.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
            [username, email, passwordHash]
        )

        res.status(201).json(result.rows[0])
    } catch (error) {
        next(error)
    }
})

router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ error: "Sähköposti ja salasana vaaditaan" })
        }

        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email])
        const user = result.rows[0]

        if (!user) {
            return res.status(401).json({ error: "Väärä tunnus tai salasana" })
        }

        const passwordMatches = await bcrypt.compare(password, user.password_hash)
        if (!passwordMatches) {
            return res.status(401).json({ error: "Väärä tunnus tai salasana" })
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        res.status(200).json({
            token,
            user: { id: user.id, username: user.username, email: user.email }
        })
    } catch (error) {
        next(error)
    }
})

export default router
