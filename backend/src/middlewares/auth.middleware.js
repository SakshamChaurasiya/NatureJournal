/**
 * @file auth.middleware.js
 * @description Middleware responsible for protecting routes
 * by verifying the JWT token stored in cookies.
 */
const jwt = require("jsonwebtoken");

/**
 * @middleware authMiddleware
 * @description Validates JWT token from request cookies.
 * If valid, attaches decoded user data to req.user.
 * If invalid or missing, returns an Unauthorized response.
 */
function authMiddleware(req, res, next) {
    try {
        // token stored in cookies
        const token = req.cookies?.token;


        if (!token) {
            return res.status(401).json({
                message: "Unauthorized: Token missing"
            });
        }

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // attach user info to request
        req.user = decoded;

        next();


    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized: Invalid or expired token"
        });
    }
}

module.exports = authMiddleware;
