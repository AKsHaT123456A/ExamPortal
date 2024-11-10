import express, { json, urlencoded } from "express";
import { createServer } from 'http';
import helmet, { contentSecurityPolicy } from 'helmet';
import compression from 'compression';
import { Server as socketIO } from 'socket.io';
import constants from "./Connections/constants.js";
import client from "prom-client";


import connectDB from "./Connections/db.js";
import { socketSetup } from "./Utils/leaderSocket.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from 'cookie-parser';
// Create an Express app
const app = express();

// Create an HTTP server using the Express app
const server = createServer(app);

// Create a Socket.IO instance attached to the server
const io = new socketIO(server, {
  cors: {
    origin: ['https://csi-exam-portal.vercel.app/','https://examportal-2.onrender.com/'],
    methods: ['GET', 'POST'],
  },
});

// API prefix
const apiPrefix = '/api/v1';

// Import routes
import authRoute from "./Routes/authRoute.js";
import quesRoute from "./Routes/quesRoute.js";
import resRoute from "./Routes/resRoute.js";
import catRoute from "./Routes/catRoute.js";

import { metricsMiddleware } from "./monitoring/index.js";
// Database connection
connectDB();

// Set trust proxy for reverse proxy support
app.set("trust proxy", 1);

// Middleware setup
app.use(cors());
app.use(metricsMiddleware);
app.use(cookieParser());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(helmet());
app.use(compression());
// Content Security Policy middleware using Helmet
app.use(
  contentSecurityPolicy()
);

// Socket setup
socketSetup(io);

// Routes
app.use(`${apiPrefix}/auth`, authRoute);
app.use(`${apiPrefix}`, quesRoute);
app.use(`${apiPrefix}`, resRoute);
app.use(`${apiPrefix}/category`, catRoute);
app.get("/metrics", async (_req, res) => {
  if (!user || user.name !== constants.PROMETHEUSER || user.pass !== constants.PROMETHEPASS) {
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="Metrics"');
    return res.end('Access denied');
  }
  const metrics = await client.register.metrics();
  res.set('Content-Type', client.register.contentType);
  res.end(metrics);
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error", err: err.message });
});




// Start the server
server.listen(constants.PORT, "0.0.0.0", () => {
  console.log(` Server running at port ${constants.PORT}`);
});