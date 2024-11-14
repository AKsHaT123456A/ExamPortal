import { Request, Response, NextFunction } from "express";
import { MetricsClass } from "../services/monitoring-service";

export const metrics = (req: Request, res: Response, next: NextFunction) => {
  const metrics = MetricsClass.getInstance(); // Get the singleton instance of metrics
  const timer = metrics.httpRequestDurationSeconds.startTimer();
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
