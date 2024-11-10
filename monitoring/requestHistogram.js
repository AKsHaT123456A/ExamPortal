import client from "prom-client";
export const activeRequestHistogram = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in ms",
    labelNames: ["method", "route","code"],
    buckets: [0.1, 0.5, 1, 1.5, 2, 3, 5, 100, 400, 600],
});



