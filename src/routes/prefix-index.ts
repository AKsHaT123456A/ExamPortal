import express from "express";
import client from 'prom-client';
import basicAuth from 'basic-auth';

import apiRoutes from "./index";
import constants from "../config/constants";

//@ts-ignore

const router = express.Router();
router.use("/api/v1", apiRoutes);

//@ts-ignore
router.get("/metrics", (req, res) => {
    (async () => {
      const user = basicAuth(req);
      if (!user || user.name !== constants.PROMETHEUSER || user.pass !== constants.PROMETHEPASS) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="Metrics"');
        return res.end('Access denied');
      }
      const metrics = await client.register.metrics();
      console.log(metrics);
      
      res.set('Content-Type', client.register.contentType);
      res.end(metrics);
    })().catch(err => {
      console.error(err);
      res.status(500).end('Internal Server Error');
    });
  });

  router.get('/', async (_req, res, _next) => {

    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        reponseTime:process.hrtime(),
        timestamp: Date.now()
    };
    try {
        res.send(healthcheck);
    } catch (error) {
      //@ts-ignore
        healthcheck.message = error;
        res.status(503).send();
    }
});
export default router;
