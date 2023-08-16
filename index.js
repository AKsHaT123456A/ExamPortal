const express = require("express");
const http = require('http');
const helmet = require('helmet');
const compression = require('compression');
const socketIO = require('socket.io');
const cors = require('cors');
const constants = require("./Connections/constants");
const connectDB = require("./Connections/db");
const { socketSetup } = require("./Utils/leaderSocket");
const corsMiddleware = require("./middleware/corsMiddleware");
const logger = require("./middleware/logger");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const apiPrefix = '/api/v1';

// Database connection
connectDB();

// Set trust proxy for reverse proxy support
app.set("trust proxy", 1);

// Middleware setup
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(compression());
// Content Security Policy middleware using Helmet
app.use(
    helmet.contentSecurityPolicy()
);

// Socket setup
socketSetup(io);

// Routes
const routes = [
    { path: "/auth", router: require("./Routes/authRoute") },
    { path: "/res", router: require("./Routes/resRoute") },
    { path: "/lead", router: require("./Routes/leaderRoute") },
    { path: "/ques", router: require("./Routes/quesRoute") },
];

routes.forEach(route => {
    app.use(`${apiPrefix}${route.path}`, route.router);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
server.listen(constants.PORT, () => {
    console.log(`Server running at port ${constants.PORT}`);
});
