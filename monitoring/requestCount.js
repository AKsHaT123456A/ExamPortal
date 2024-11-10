import client from "prom-client";
export const requestCounter = new client.Counter({
  name: "request_counter",
  help: "request_counter_help",
  labelNames: ["method", "route","status_code"],
});


