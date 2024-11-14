"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerTest = loggerTest;
const queue_service_1 = __importDefault(require("../services/queue-service"));
function loggerTest() {
    queue_service_1.default.on("completed", (job) => {
        console.log(`Job with ID ${job.id} completed successfully.`);
    });
    queue_service_1.default.on("failed", (job, error) => {
        console.error(`Job with ID ${job.id} failed with error: ${error.message}`);
    });
}
