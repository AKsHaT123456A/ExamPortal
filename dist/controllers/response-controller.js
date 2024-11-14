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
const response_service_1 = __importDefault(require("../services/response-service"));
class ResponseController {
    constructor() {
        this.responseService = response_service_1.default.getInstance();
    }
    // Handle the response (create or update)
    //@ts-ignore
    handleResponse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { status, quesId, ansId } = req.query;
                if (!id || !status || !quesId || !ansId) {
                    res.status(400).json({ message: "Missing required parameters" });
                    return;
                }
                const result = yield this.responseService.handleResponse(id, status, quesId, ansId);
                res.status(200).json({
                    message: result.message,
                    userResponses: result.user,
                    category: result.category,
                });
            }
            catch (error) {
                //@ts-ignore
                let err = error;
                res
                    .status(500)
                    .json({
                    message: err.message || "An error occurred while handling the response",
                });
            }
        });
    }
    // Fetch the user responses
    userResponse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { studentNo } = req.params;
                const result = yield this.responseService.userResponse(studentNo);
                res.status(200).json(result);
            }
            catch (error) {
                //@ts-ignore
                res
                    .status(500)
                    .json({
                    message: 
                    //@ts-ignore
                    error.message || "An error occurred while fetching user responses",
                });
            }
        });
    }
}
exports.default = ResponseController;
