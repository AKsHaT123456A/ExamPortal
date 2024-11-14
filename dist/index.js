"use strict";
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
const express_1 = __importDefault(require("express"));
const db_connection_1 = require("./db/db-connection");
const prefix_index_1 = __importDefault(require("./routes/prefix-index"));
const logger_1 = require("./metrics/logger");
const cors_1 = __importDefault(require("cors"));
const prom_client_1 = __importDefault(require("prom-client"));
const http_1 = __importDefault(require("http"));
const constants_1 = __importDefault(require("./config/constants"));
const monitoring_middleware_1 = require("./middleware/monitoring-middleware");
const app = (0, express_1.default)();
app.use(monitoring_middleware_1.metrics);
const basic_auth_1 = __importDefault(require("basic-auth"));
const socket_ws_1 = __importDefault(require("./ws/socket-ws"));
const websocketServer = socket_ws_1.default.getInstance();
function startApp() {
    return __awaiter(this, void 0, void 0, function* () {
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        const mongo = db_connection_1.MongoDB.getInstance();
        yield mongo.connect();
        app.use(prefix_index_1.default);
        app.use(logger_1.loggerTest);
        const server = http_1.default.createServer(app);
        // Attach the WebSocket server to handle the upgrade requests
        //@ts-ignore
        server.on('upgrade', (request, socket, head) => {
            // Handle WebSocket upgrade reques
            //@ts-ignore
            websocketServer.handleUpgrade(request, socket, head);
        });
        server.listen(constants_1.default.PORT, () => {
            console.log(`Server is running on http://localhost:${constants_1.default.PORT}`);
        });
    });
}
app.get("/metrics", (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const user = (0, basic_auth_1.default)(req);
        if (!user || user.name !== constants_1.default.PROMETHEUSER || user.pass !== constants_1.default.PROMETHEPASS) {
            res.statusCode = 401;
            res.setHeader('WWW-Authenticate', 'Basic realm="Metrics"');
            return res.end('Access denied');
        }
        const metrics = yield prom_client_1.default.register.metrics();
        res.set('Content-Type', prom_client_1.default.register.contentType);
        res.end(metrics);
    }))().catch(err => {
        console.error(err);
        res.status(500).end('Internal Server Error');
    });
});
app.use((0, cors_1.default)());
// Graceful shutdown
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Shutting down gracefully...");
    const mongo = db_connection_1.MongoDB.getInstance();
    yield mongo.disconnect();
    process.exit(0);
}));
startApp(); // Start the app
