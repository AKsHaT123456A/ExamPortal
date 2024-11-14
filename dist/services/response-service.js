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
const redis_cache_1 = require("../cache/redis-cache");
const constants_1 = __importDefault(require("../config/constants"));
const question_model_1 = __importDefault(require("../models/question-model"));
const question_response_model_1 = __importDefault(require("../models/question-response-model"));
const user_model_1 = __importDefault(require("../models/user-model"));
const queue_service_1 = __importDefault(require("../services/queue-service"));
class ResponseService {
    constructor() { }
    static getInstance() {
        if (!ResponseService.instance) {
            ResponseService.instance = new ResponseService();
        }
        return ResponseService.instance;
    }
    handleResponse(id, status, quesId, ansId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ques = yield question_model_1.default.findOne({ quesId });
            if (!ques) {
                throw new Error("Question not found!");
            }
            const { correctId } = ques;
            const ansStatusMapping = {
                0: ansId === correctId ? 2 : -1,
                1: ansId === correctId ? 3 : -2,
            };
            const ansStatus = ansStatusMapping[status] || 0;
            const score = ansStatus === 2 || ansStatus === 3 ? 1 : 0;
            let existingResponse = yield question_response_model_1.default.findOne({
                quesId,
                userId: id,
            });
            const user = yield user_model_1.default.findById(id);
            if (!existingResponse) {
                existingResponse = yield question_response_model_1.default.create({
                    ansStatus,
                    score,
                    quesId,
                    ansId,
                    category: ques.category,
                    userId: id,
                });
                if (user) {
                    user.responses = [...user.responses, existingResponse.id];
                    if (user.calculatedTotalScore !== undefined) {
                        user.calculatedTotalScore += score;
                    }
                    else {
                        user.calculatedTotalScore = score;
                    }
                    yield user.save();
                }
            }
            else {
                const oldScore = existingResponse.score;
                const scoreChange = score - oldScore;
                existingResponse.score = score;
                existingResponse.ansStatus = ansStatus;
                existingResponse.ansId = ansId;
                if (user) {
                    user.calculatedTotalScore += scoreChange;
                }
                yield existingResponse.save();
                if (user) {
                    yield user.save();
                }
            }
            const userWithResponses = yield user_model_1.default.findById(id).populate({
                path: "responses",
                select: "ansStatus score quesId ansId category -_id",
            });
            if (!userWithResponses) {
                throw new Error("User with responses not found!");
            }
            const users = [userWithResponses];
            const userType = "admin";
            yield queue_service_1.default.add({
                users,
                userType,
            });
            return {
                message: existingResponse._id
                    ? "Response updated successfully"
                    : "Response recorded successfully",
                user: userWithResponses.responses,
                category: userWithResponses.category,
            };
        });
    }
    // Add the userResponse method to the ResponseService class
    userResponse(studentNo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findOne({ studentNo }).populate({
                    path: "responses",
                    select: "ansStatus score quesId ansId -_id",
                });
                const redisCache = redis_cache_1.RedisCache.getInstance(constants_1.default.REDIS_URL);
                const cache = yield redisCache.get((user === null || user === void 0 ? void 0 : user._id.toString()) || "");
                if (cache) {
                    return {
                        //@ts-ignore
                        responses: cache,
                    };
                }
                yield redisCache.set((user === null || user === void 0 ? void 0 : user.responses) || [], (user === null || user === void 0 ? void 0 : user._id.toString()) || "");
                if (!user) {
                    throw new Error("User not found");
                }
                return {
                    responses: user.responses,
                };
            }
            catch (error) {
                console.log(error);
                throw new Error(`Error fetching user responses:`);
            }
        });
    }
}
exports.default = ResponseService;
