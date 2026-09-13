import { Router } from "express"
import bcrypt from "bcrypt"
import { pool } from "./db/index.js"

const router = Router()

router.post("/register", async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Kaikki kentät vaaditaan" });
        }

        const passwordRules = /^(?=.*[A-Z])(?=.*\d).{8,}$/
        if (!passwordRules.test(password)) {
        return res.status(400).json({
        error: "Salasanan pitää olla vähintään 8 merkkiä ja sisältää vähintään yksi iso kirjain ja yksi numero"
        })
        }


        const existing = await pool.query("SELECT id FROM users WHERE email = $1 OR username = $2", [email, username]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: "Sähköposti tai käyttäjänimi on jo käytössä" });
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const result = await pool.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
            [username, email, passwordHash]
        );

        res.status(201).json(result.rows[0])
    } catch (error) {
        next(error)
    }
})

export default router;
