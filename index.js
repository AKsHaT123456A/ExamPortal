const express = require("express");
const http = require('http');
const helmet = require('helmet');
const compression = require('compression');
const socketIO = require('socket.io');
const constants = require("./Connections/constants");
const connectDB = require("./Connections/db");
const { socketSetup } = require("./Utils/leaderSocket");
const corsMiddleware = require("./middleware/corsMiddleware");
require("dotenv").config();

// Create an Express app
const app = express();

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Create a Socket.IO instance attached to the server
const io = socketIO(server);

// API prefix
const apiPrefix = '/api/v1';

// Import routes
const authRoute = require("./Routes/authRoute");
const quesRoute = require("./Routes/quesRoute");
const resRoute = require("./Routes/resRoute");

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
  app.use(`${apiPrefix}`, authRoute);
  app.use(`${apiPrefix}`, quesRoute);
  app.use(`${apiPrefix}`, resRoute);

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  });

  // Start the server
  server.listen(constants.PORT, () => {
    console.log(` Server running at port ${constants.PORT}`);
  });

