//jshint esversion:6
const express = require("express");
const http = require('http');
const helmet = require('helmet');
const compression = require('compression');
const socketIO = require('socket.io');
const cors = require('cors');
const constants = require("./Connections/constants");
const connectDB = require("./Connections/db");
require("dotenv").config();

const authRouter = require("./Routes/authRoute");
const resRouter = require("./Routes/resRoute");
const leadRouter = require("./Routes/leaderRoute");
const quesRouter = require("./Routes/quesRoute");
const { updateLeaderboard } = require("./Utils/leaderSocket");
const browserOnlyMiddleware = require("./middleware.js/browserCheckMiddleware");



const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const apiPrefix = '/api/v1';

// Database connection
connectDB();

// Set trust proxy for reverse proxy support
app.set("trust proxy", 1);

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(compression());
// app.use(browserOnlyMiddleware);

const allowedOrigins = ['http://localhost:5173', "http://127.0.0.1:5173", 'http://localhost:3000', 'http://127.0.0.1:5500', 'deployed link'];

// CORS configuration middleware
app.use(
    cors({
        origin: (origin, callback) => {
            if (allowedOrigins.includes(origin) || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
    })
);

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


// Content Security Policy middleware using Helmet
app.use(
    helmet.contentSecurityPolicy()
);


// Socket.IO connection event
io.on('connection', (socket) => {
    console.log('A user connected');

    // Send initial leaderboard data to the client
    updateLeaderboard(io);

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

//! Routes
app.use(`${apiPrefix}`, authRouter);
app.use(`${apiPrefix}`, resRouter);
app.use(`${apiPrefix}`, leadRouter);
app.use(`${apiPrefix}`, quesRouter);


// Start the server
server.listen(constants.PORT, () => console.log(`Server running at port ${constants.PORT}`));
