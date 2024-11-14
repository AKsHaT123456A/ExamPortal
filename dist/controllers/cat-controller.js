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
exports.updateCategory = updateCategory;
const user_model_1 = __importDefault(require("../models/user-model"));
function updateCategory(req, 
//@ts-ignore
res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { category } = req.query;
            const { id } = req.params;
            if (!category) {
                const foundCategory = yield user_model_1.default.findById(id).select("category");
                if (foundCategory) {
                    return res.status(200).json({ category: foundCategory.category });
                }
                else {
                    return res.status(404).json({ message: "Category not found" });
                }
            }
            const updatedUser = yield user_model_1.default.findOneAndUpdate({ _id: id }, { $set: { category } });
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }
            return res
                .status(200)
                .json({ message: "Category updated successfully", category: category });
        }
        catch (error) {
            return (res
                .status(500)
                //@ts-ignore
                .json({ error: "Internal Server Error", message: error.message }));
        }
    });
}
