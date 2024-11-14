"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metrics = void 0;
const monitoring_service_1 = require("../services/monitoring-service");
const metrics = (req, res, next) => {
    const metrics = monitoring_service_1.MetricsClass.getInstance(); // Get the singleton instance of metrics
    const timer = metrics.httpRequestDurationSeconds.startTimer();
    console.log("metrics", metrics);
    res.on("finish", () => {
        // Increment the request counter
        metrics.totalHttpRequests.inc({
            http_method: req.method,
            endpoint: req.originalUrl,
            http_status: res.statusCode,
        });
        // Record the request duration
        timer({
            http_method: req.method,
            endpoint: req.originalUrl,
            http_status: res.statusCode,
        });
    });
    next();
};
exports.metrics = metrics;
