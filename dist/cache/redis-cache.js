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
exports.RedisCache = void 0;
const ioredis_1 = require("ioredis");
const socket_ws_1 = __importDefault(require("../ws/socket-ws"));
class RedisCache {
    constructor(redisUrl) {
        this.wsServer = socket_ws_1.default.getInstance(); // For broadcasting leaderboard updates
        // Connect to Redis for publishing and subscribing
        this.client = new ioredis_1.Redis(redisUrl);
        this.redisPublisher = new ioredis_1.Redis(redisUrl); // Redis publisher
        this.redisSubscriber = new ioredis_1.Redis(redisUrl); // Redis subscriber
        // Subscribe to the 'leaderboard' channel to listen for updates
        this.redisSubscriber.subscribe("leaderboard", (err, _count) => {
            console.log("Subscribed to leaderboard channel");
            if (err) {
                console.error("Failed to subscribe to leaderboard channel", err);
            }
        });
        // On receiving leaderboard updates from Redis, broadcast to WebSocket clients
        this.redisSubscriber.on("message", (channel, message) => {
            if (channel === "leaderboard") {
                this.wsServer.broadcast(message); // Broadcast to WebSocket clients
            }
        });
    }
    static getInstance(redisUrl) {
        if (!this.instance) {
            this.instance = new RedisCache(redisUrl);
        }
        return this.instance;
    }
    get(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const value = yield this.client.get(userId);
                return value ? JSON.parse(value) : null;
            }
            catch (error) {
                console.error(`Error retrieving cache for${userId}:`, error);
                return null;
            }
        });
    }
    getQuestions() {
        return this.client.get("questions");
    }
    setQuestions(questions) {
        return this.client.set("questions", JSON.stringify(questions));
    }
    set(responses, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const expirationTimeInSeconds = 3600 * 5;
                yield this.client.set(userId, JSON.stringify(responses), "EX", expirationTimeInSeconds);
            }
            catch (error) {
                console.error(`Error setting cache for ${userId}:`, error);
            }
        });
    }
    evict(quesId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const key = yield this.generateKey(quesId, userId);
                yield this.client.del(key);
                return null;
            }
            catch (error) {
                console.error(`Error evicting cache for ${quesId}:${userId}:`, error);
                return null;
            }
        });
    }
    generateKey(quesId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return `${quesId}:${userId}`;
        });
    }
    getTopPlayers(n) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Retrieve the top players (userId and their score) from the leaderboard
                const topPlayers = yield this.client.zrevrange("leaderboard", 0, n, "WITHSCORES");
                const playerDetailsPromises = topPlayers.map((Member, index) => __awaiter(this, void 0, void 0, function* () {
                    const playerData = yield this.client.hgetall(`user:${Member}`);
                    return {
                        userId: Member,
                        score: parseInt(topPlayers[index + 1], 10),
                        studentNo: playerData.studentNo,
                        name: playerData.name,
                    };
                }));
                // Wait for all player details to be fetched
                const playersWithDetails = yield Promise.all(playerDetailsPromises);
                return playersWithDetails;
            }
            catch (error) {
                console.error(`Error retrieving top ${n} players:`, error);
                return [];
            }
        });
    }
    updatePlayerScore(playerScores) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pipeline = this.client.pipeline();
                playerScores.forEach(({ userId, calculatedTotalScore, studentNo, name }) => {
                    pipeline.zadd("leaderboard", calculatedTotalScore.toString(), userId);
                    pipeline.hset(`user:${userId}`, "studentNo", studentNo, "name", name);
                });
                // Execute the pipeline
                yield pipeline.exec();
                // Publish leaderboard update
                yield this.publishLeaderboard();
            }
            catch (error) {
                console.error(`Error updating score for `, error);
            }
        });
    }
    publishLeaderboard() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const topPlayers = yield this.getTopPlayers(10);
                yield this.redisPublisher.publish("leaderboard", JSON.stringify(topPlayers));
            }
            catch (error) {
                console.error("Error publishing leaderboard:", error);
            }
        });
    }
    clearLeaderboard() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.del("leaderboard");
                yield this.publishLeaderboard();
            }
            catch (error) {
                console.error("Error clearing leaderboard:", error);
            }
        });
    }
    // Close Redis connections
    close() {
        this.redisPublisher.quit();
        this.redisSubscriber.quit();
        this.client.quit();
    }
}
exports.RedisCache = RedisCache;
