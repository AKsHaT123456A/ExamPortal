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
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaderboardServiceUserType = void 0;
const console_1 = require("console");
const leaderboard_service_1 = require("../services/leaderboard-service");
const leaderboardService = leaderboard_service_1.LeaderboardServiceSingleton.getInstance();
const leaderboardServiceUserType = (user, userId) => __awaiter(void 0, void 0, void 0, function* () {
    (0, console_1.log)(`Fetching leaderboard data for user type: ${userId}`);
    yield leaderboardService.updateAndEmit(user, userId);
});
exports.leaderboardServiceUserType = leaderboardServiceUserType;
