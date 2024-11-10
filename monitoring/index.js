import { requestCounter } from "./requestCount.js";
import { activeRequestsGauge } from "./requestGauge.js";
import { activeRequestHistogram } from "./requestHistogram.js";

export const metricsMiddleware = (req, res, next) => {
    const startTime = Date.now();
    activeRequestsGauge.inc();

    res.on('finish', function() {
        const endTime = Date.now();
        const duration = endTime - startTime;
    
        // Increment request counter
        requestCounter.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode
        });

        activeRequestHistogram.observe({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            code: res.statusCode
        }, duration);

        activeRequestsGauge.dec();
    });
    next();
}