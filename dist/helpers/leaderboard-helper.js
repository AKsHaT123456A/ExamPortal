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
exports.updateLeaderboardAndEmit = void 0;
const user_model_1 = __importDefault(require("../models/user-model"));
const socket_ws_1 = __importDefault(require("../ws/socket-ws"));
const wsServer = socket_ws_1.default.getInstance();
wsServer.start();
let leaderboardData = [];
const updateLeaderboardAndEmit = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find()
            .populate("responses")
            .select(" studentNo name userId");
        leaderboardData = users.map((user) => {
            const calculatedTotalScore = user.responses.reduce((total, response) => total + response.score, 0);
            return {
                studentNo: user.studentNo,
                name: user.name,
                calculatedTotalScore: calculatedTotalScore,
                userId: user.userId,
            };
        });
        leaderboardData.sort((a, b) => b.calculatedTotalScore - a.calculatedTotalScore);
        wsServer.broadcast(JSON.stringify(leaderboardData));
    }
    catch (error) {
        console.error(error);
    }
});
exports.updateLeaderboardAndEmit = updateLeaderboardAndEmit;
