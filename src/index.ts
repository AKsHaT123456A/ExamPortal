import express from "express";
import { MongoDB } from "./db/db-connection";
import indexRouter from "./routes/prefix-index";
import { loggerTest } from "./metrics/logger";
import cors from "cors";
import client from 'prom-client';
import http from 'http'; 
import constants from "./config/constants";
import { metrics } from "./middleware/monitoring-middleware";
const app = express();
app.use(metrics)

import basicAuth from 'basic-auth';
import WebSocketServerSingleton from "./ws/socket-ws";
import { startEmailConsumer } from "./utils/email-utils";
const websocketServer = WebSocketServerSingleton.getInstance();
async function startApp() {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const mongo = MongoDB.getInstance();
  await mongo.connect();
  app.use(indexRouter);
  app.use(loggerTest);
  const server = http.createServer(app);

  // Attach the WebSocket server to handle the upgrade requests
  //@ts-ignore
  server.on('upgrade', (request, socket, head) => {
    // Handle WebSocket upgrade reques
    //@ts-ignore
      websocketServer.handleUpgrade(request, socket, head); 
    });
  server.listen(constants.PORT, () => {
    console.log(`Server is running on port ${constants.PORT}`);
  });
}
app.get("/metrics", (req, res) => {
  (async () => {
    const user = basicAuth(req);
    if (!user || user.name !== constants.PROMETHEUSER || user.pass !== constants.PROMETHEPASS) {
      res.statusCode = 401;
      res.setHeader('WWW-Authenticate', 'Basic realm="Metrics"');
      return res.end('Access denied');
    }
    const metrics = await client.register.metrics();
    res.set('Content-Type', client.register.contentType);
    res.end(metrics);
  })().catch(err => {
    console.error(err);
    res.status(500).end('Internal Server Error');
  });
});
app.use(cors());
startEmailConsumer()
  .then(() => {
    console.log("Email consumer started.");
  })
  .catch((error) => {
    console.error("Failed to start email consumer:", error);
  });
// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  const mongo = MongoDB.getInstance();
  await mongo.disconnect();
  process.exit(0);
});

startApp(); // Start the app
