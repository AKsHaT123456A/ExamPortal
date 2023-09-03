const rateLimit = require("express-rate-limit");

// Apply rate limiting to certain routes
const limiter = (req, res, next) => {
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // Limit to 5 requests per IP within the window
    });
    next();
}

module.exports = limiter;
