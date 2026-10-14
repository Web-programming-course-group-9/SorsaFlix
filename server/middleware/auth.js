// Middleware: checks that the request has a valid login token.
// If the token is valid, the request continues to the route.
// If not, the request is stopped with a 401 (not allowed) response.

import jwt from "jsonwebtoken"

function requireAuth(req, res, next) {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization

    // If the header is missing or doesn't start with "Bearer ", return 401
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" })
    }

    // Take only token part from the header (after "Bearer ")
    const token = authHeader.split(" ")[1]
    
    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Save the decoded user information in the request object for use in the route
        req.user = decoded

        // Token OK let the request continue to the route
        next()
        // Token is invalid or expired, return 401
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" })
    }
}

export default requireAuth