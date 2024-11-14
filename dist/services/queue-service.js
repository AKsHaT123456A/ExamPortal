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
const bull_1 = __importDefault(require("bull"));
const leaderboard_service_1 = require("../services/leaderboard-service");
const console_1 = require("console");
const constants_1 = __importDefault(require("../config/constants"));
class LeaderboardQueueSingleton {
    constructor() { }
    static getInstance() {
        if (!LeaderboardQueueSingleton.instance) {
            LeaderboardQueueSingleton.instance = new bull_1.default("leaderboardQueue", constants_1.default.REDIS_URL || "redis://localhost:6379", {
                defaultJobOptions: {
                    removeOnComplete: true,
                    removeOnFail: {
                        count: 3,
                    },
                },
            });
            (0, console_1.log)("Leaderboard queue created");
            // Define the queue's job processing function
            LeaderboardQueueSingleton.instance.process((job) => __awaiter(this, void 0, void 0, function* () {
                const { users, userType } = job.data;
                const leaderboardService = leaderboard_service_1.LeaderboardServiceSingleton.getInstance();
                yield leaderboardService.updateAndEmit(users, userType);
            }));
            // Add event listeners for job completion and failure
            LeaderboardQueueSingleton.instance.on("completed", (job) => {
                console.log(`Job with ID ${job.id} completed successfully.`);
            });
            LeaderboardQueueSingleton.instance.on("failed", (job, error) => {
                console.error(`Job with ID ${job.id} failed with error: ${error.message}`);
            });
        }
        return LeaderboardQueueSingleton.instance;
    }
}
// Export the singleton instance function
exports.default = LeaderboardQueueSingleton.getInstance();
