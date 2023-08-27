const cors = require("cors");

const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:5175', 'http://localhost:3000', 'http://127.0.0.1:5500', 'https://csiportal.vercel.app/', 'https://csi-portal.netlify.app/'];

const corsMiddleware = cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
    optionsSuccessStatus: 200,
});

module.exports = corsMiddleware;
