"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsClass = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
class MetricsClass {
    constructor() {
        // Define HTTP request counter
        this.totalHttpRequests = new prom_client_1.default.Counter({
            name: 'app_http_requests_total',
            help: 'Total number of HTTP requests made to the app',
            labelNames: ['http_method', 'endpoint', 'http_status'],
        });
        // Define HTTP request duration histogram
        this.httpRequestDurationSeconds = new prom_client_1.default.Histogram({
            name: 'app_http_request_duration_seconds',
            help: 'Histogram of HTTP request durations in seconds',
            labelNames: ['http_method', 'endpoint', 'http_status'],
        });
        // Define gauge for active WebSocket connections
        this.activeSocketConnections = new prom_client_1.default.Gauge({
            name: 'app_active_socket_connections',
            help: 'Current number of active WebSocket connections',
        });
        // Collect default metrics with prefix
        prom_client_1.default.collectDefaultMetrics({ prefix: 'app_' });
    }
    // Static method to get the singleton instance
    static getInstance() {
        if (!MetricsClass.instance) {
            MetricsClass.instance = new MetricsClass();
        }
        return MetricsClass.instance;
    }
    // Method to increment the active socket connection gauge
    incrementSocketConnections() {
        this.activeSocketConnections.inc();
    }
    // Method to decrement the active socket connection gauge
    decrementSocketConnections() {
        this.activeSocketConnections.dec();
    }
}
exports.MetricsClass = MetricsClass;
