import client from "prom-client";
export const activeRequestsGauge = new client.Gauge({
    name: "active_requests",
    help: "Total number of requests active and are not resolved yet",
});


