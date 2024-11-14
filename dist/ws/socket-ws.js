"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importStar(require("ws"));
const url_1 = __importDefault(require("url"));
const redis_cache_1 = require("../cache/redis-cache");
const constants_1 = __importDefault(require("../config/constants"));
const monitoring_service_1 = require("../services/monitoring-service");
const metrics = monitoring_service_1.MetricsClass.getInstance();
class WebSocketServerSingleton {
    constructor() {
        this.wss = new ws_1.WebSocketServer({ noServer: true, path: '/ws' });
        this.wss.on('connection', this.onConnection.bind(this));
    }
    // Singleton pattern to get the instance of WebSocketServerSingleton
    static getInstance() {
        if (!WebSocketServerSingleton.instance) {
            WebSocketServerSingleton.instance = new WebSocketServerSingleton();
        }
        return WebSocketServerSingleton.instance;
    }
    // Start the WebSocket server
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('WebSocket server started on port ' + this.wss.options.port);
        });
    }
    // Handle new connections
    onConnection(ws, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryParams = url_1.default.parse(req.url, true).query;
            const userId = queryParams.userId;
            const role = queryParams.role;
            const redisCache = redis_cache_1.RedisCache.getInstance(constants_1.default.REDIS_URL || "redis://localhost:6379");
            yield redisCache.updatePlayerScore([{
                    studentNo: userId,
                    calculatedTotalScore: 0,
                    name: userId,
                    userId: userId,
                }]);
            // Attach userId and role to the ws client instance
            ws.userId = userId;
            ws.role = role;
            metrics.incrementSocketConnections();
            console.log(`New WebSocket connection established for user: ${userId}, role: ${role}`);
            // Listen for messages from the connected client
            ws.on('message', (message) => __awaiter(this, void 0, void 0, function* () {
                console.log('Received message:', message.toString());
            }));
            // Handle connection close
            ws.on('close', () => {
                metrics.decrementSocketConnections();
                console.log(`WebSocket connection closed for user: ${userId}`);
            });
            // Handle WebSocket errors
            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
            });
        });
    }
    // Broadcast a message to all connected clients
    broadcast(message) {
        this.wss.clients.forEach((client) => {
            if (client instanceof ws_1.default && client.readyState === ws_1.default.OPEN) {
                client.send(message.toString());
            }
        });
    }
    // Send a message to a specific client
    sendToClient(client, message) {
        if (client.readyState === ws_1.default.OPEN) {
            client.send(message.toString());
        }
    }
    handleUpgrade(request, socket, head) {
        this.wss.handleUpgrade(request, socket, head, (ws) => {
            this.wss.emit('connection', ws, request);
        });
    }
    // Close the WebSocket server
    close() {
        this.wss.close(() => {
            console.log('WebSocket server has been closed');
        });
    }
    // Get all connected clients
    getClients() {
        return Array.from(this.wss.clients);
    }
}
exports.default = WebSocketServerSingleton;
