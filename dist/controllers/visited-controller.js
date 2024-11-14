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
exports.isVisited = isVisited;
const visited_model_1 = __importDefault(require("../models/visited-model"));
//@ts-ignore
function isVisited(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const { category, quesId } = req.query;
        try {
            const foundVisited = yield visited_model_1.default.findOne({ userId: id, category, quesId, isVisited: true });
            if (foundVisited) {
                const alreadyVisited = yield visited_model_1.default.find({ userId: id, isVisited: true });
                return res.status(200).json(alreadyVisited);
            }
            yield visited_model_1.default.create({ userId: id, category, quesId });
            const updatedVisited = yield visited_model_1.default.find({ userId: id });
            return res.status(200).json(updatedVisited);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
}
