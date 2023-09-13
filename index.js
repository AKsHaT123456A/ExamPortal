const express = require("express");
const http = require('http');
const helmet = require('helmet');
const compression = require('compression');
const socketIO = require('socket.io');
const constants = require("./Connections/constants");
const connectDB = require("./Connections/db");
const { socketSetup } = require("./Utils/leaderSocket");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require('cookie-parser');
// Create an Express app
const app = express();

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Create a Socket.IO instance attached to the server
const io = socketIO(server, {
  cors: {
    origin: 'https://csi-portal.netlify.app',
    methods: ['GET', 'POST'],
  },
});

// API prefix
const apiPrefix = '/api/v1';

// Import routes
const authRoute = require("./Routes/authRoute");
const quesRoute = require("./Routes/quesRoute");
const resRoute = require("./Routes/resRoute");
const catRoute = require("./Routes/catRoute");
// Database connection
connectDB();

// Set trust proxy for reverse proxy support
app.set("trust proxy", 1);

// Middleware setup
app.use(cors());
app.use(cookieParser());
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
app.use(`${apiPrefix}/auth`, authRoute);
app.use(`${apiPrefix}`, quesRoute);
app.use(`${apiPrefix}`, resRoute);
app.use(`${apiPrefix}/category`, catRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" ,err:err.message});
});

// Start the server
server.listen(constants.PORT, () => {
  console.log(` Server running at port ${constants.PORT}`);
});

