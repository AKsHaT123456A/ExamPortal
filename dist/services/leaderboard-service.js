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
exports.LeaderboardServiceSingleton = void 0;
const socket_ws_1 = __importDefault(require("../ws/socket-ws"));
const redis_cache_1 = require("../cache/redis-cache");
const constants_1 = __importDefault(require("../config/constants"));
const user_model_1 = __importDefault(require("../models/user-model"));
const wsServer = socket_ws_1.default.getInstance();
wsServer.start();
class LeaderboardServiceSingleton {
    constructor() {
        this.leaderboardData = [];
    }
    static getInstance() {
        if (!LeaderboardServiceSingleton.instance) {
            LeaderboardServiceSingleton.instance = new LeaderboardServiceSingleton();
        }
        return LeaderboardServiceSingleton.instance;
    }
    updateAndEmit(users, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const redisCache = redis_cache_1.RedisCache.getInstance(constants_1.default.REDIS_URL || "redis://localhost:6379");
                // Process each user's score and prepare data for bulk update
                const playerScores = users
                    .map((user) => {
                    const calculatedTotalScore = userType === "admin"
                        ? user.responses.reduce((total, response) => total + response.score, 0)
                        : null;
                    if (calculatedTotalScore !== null) {
                        return {
                            studentNo: user.studentNo,
                            calculatedTotalScore: calculatedTotalScore,
                            name: user.name,
                            userId: user._id.toString(),
                        };
                    }
                    return null;
                })
                    .filter((score) => score !== null); // Filter out null entries
                // Bulk update player scores using the pipeline method
                if (playerScores.length > 0) {
                    yield redisCache.updatePlayerScore(playerScores);
                }
                else {
                    console.log("No player scores to update.");
                }
                // Prepare data for local leaderboardData
                users.forEach((user) => {
                    const calculatedTotalScore = userType === "admin"
                        ? user.responses.reduce((total, response) => total + response.score, 0)
                        : 0;
                    this.leaderboardData.push({
                        studentNo: user.studentNo,
                        name: user.name,
                        calculatedTotalScore: calculatedTotalScore,
                        userId: user._id.toString(),
                    });
                });
                // Sort leaderboard locally (useful for fallback or other purposes)
                this.leaderboardData.sort((a, b) => {
                    return (b.calculatedTotalScore || 0) - (a.calculatedTotalScore || 0);
                });
                const topPlayers = yield redisCache.getTopPlayers(10);
                wsServer.broadcast(JSON.stringify(topPlayers));
            }
            catch (error) {
                console.error("Error updating and emitting leaderboard:", error);
            }
        });
    }
    updateLeaderboardData() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield user_model_1.default.find()
                .populate("responses")
                .select(" studentNo name userId");
            const redisCache = redis_cache_1.RedisCache.getInstance(constants_1.default.REDIS_URL || "redis://localhost:6379");
            // Process each user's score and prepare data for bulk update
            const playerScores = users
                .map((user) => {
                const calculatedTotalScore = user.responses.reduce((total, response) => total + response.score, 0);
                if (calculatedTotalScore !== null) {
                    return {
                        studentNo: user.studentNo,
                        calculatedTotalScore: calculatedTotalScore,
                        name: user.name,
                        userId: user._id.toString(),
                    };
                }
                return null;
            })
                .filter((score) => score !== null); // Filter out null entries
            // Bulk update player scores using the pipeline method
            if (playerScores.length > 0) {
                yield redisCache.updatePlayerScore(playerScores);
            }
            else {
                console.log("No player scores to update.");
            }
            // Prepare data for local leaderboardData
            users.forEach((user) => {
                const calculatedTotalScore = user.responses.reduce((total, response) => total + response.score, 0);
                this.leaderboardData.push({
                    studentNo: user.studentNo,
                    name: user.name,
                    calculatedTotalScore: calculatedTotalScore,
                    userId: user._id.toString(),
                });
            });
            // Sort leaderboard locally (useful for fallback or other purposes)
            this.leaderboardData.sort((a, b) => {
                return (b.calculatedTotalScore || 0) - (a.calculatedTotalScore || 0);
            });
            const topPlayers = yield redisCache.getTopPlayers(10);
            wsServer.broadcast(JSON.stringify(topPlayers));
        });
    }
}
exports.LeaderboardServiceSingleton = LeaderboardServiceSingleton;
