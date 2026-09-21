//Basic Express server setup

import express from "express"
import movieRouter from "./routes/movieRouter.js"
import authRouter from "./routes/authRouter.js"
import serieRouter from "./routes/serieRouter.js"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map(origin => origin.trim())
    .filter(origin => origin.length > 0)

app.use(cors({
    origin: (requestOrigin, callback) => {
        if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true
}))    


app.use(cookieParser())
app.use(express.json())
app.use("/auth", authRouter)

// Read port from environment variable or default to 3000
const PORT = process.env.PORT || 3000

// Test route to check if the server is running
app.get("/", (req, res) => {
    res.send("server is running")
    })

// All movie routes are handled under /movies
app.use("/movies", movieRouter)

// All serie routes are handled under /series
app.use("/series", serieRouter)

// Start the server and listen on the port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    console.log(`Allowed CORS origins: ${allowedOrigins.join(", ")}`)
})
   