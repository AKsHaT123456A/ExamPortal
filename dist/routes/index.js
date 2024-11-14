"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const response_route_1 = __importDefault(require("./response-route"));
const cat_route_1 = __importDefault(require("./cat-route"));
const question_route_1 = __importDefault(require("./question-route"));
const auth_route_1 = __importDefault(require("./auth-route"));
const router = express_1.default.Router();
// Registering routes with the main router
router.use(response_route_1.default);
router.use(cat_route_1.default);
router.use(auth_route_1.default);
router.use(question_route_1.default);
exports.default = router;
