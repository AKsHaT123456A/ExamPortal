import client, { Counter, Histogram, Gauge } from 'prom-client';

export class MetricsClass {
  private static instance: MetricsClass;

  public totalHttpRequests: Counter<string>;
  public httpRequestDurationSeconds: Histogram<string>;
  public activeSocketConnections: Gauge<string>;

  private constructor() {
    // Define HTTP request counter
    this.totalHttpRequests = new client.Counter({
      name: 'app_http_requests_total',
      help: 'Total number of HTTP requests made to the app',
      labelNames: ['http_method', 'endpoint', 'http_status'],
    });

    // Define HTTP request duration histogram
    this.httpRequestDurationSeconds = new client.Histogram({
      name: 'app_http_request_duration_seconds',
      help: 'Histogram of HTTP request durations in seconds',
      labelNames: ['http_method', 'endpoint', 'http_status'],
    });

    // Define gauge for active WebSocket connections
    this.activeSocketConnections = new client.Gauge({
      name: 'app_active_socket_connections',
      help: 'Current number of active WebSocket connections',
    });

    // Collect default metrics with prefix
    client.collectDefaultMetrics({ prefix: 'app_' });
  }

  // Static method to get the singleton instance
  public static getInstance(): MetricsClass {
    if (!MetricsClass.instance) {
      MetricsClass.instance = new MetricsClass();
    }
    return MetricsClass.instance;
  }

  // Method to increment the active socket connection gauge
  public incrementSocketConnections(): void {
    this.activeSocketConnections.inc();
  }

  // Method to decrement the active socket connection gauge
  public decrementSocketConnections(): void {
    this.activeSocketConnections.dec();
  }
}
