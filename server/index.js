//Basic Express server setup

import express from "express";
import movieRouter from "./routes/movieRouter.js";

const app = express();

// Read port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Test route to check if the server is running
app.get("/", (req, res) => {
    res.send("server is running");
    });

// All movie routes are handled under /movies
app.use("/movies", movieRouter);

// Start the server and listen on the port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});