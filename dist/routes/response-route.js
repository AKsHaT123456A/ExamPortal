"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const response_controller_1 = __importDefault(require("../controllers/response-controller"));
const visited_controller_1 = require("../controllers/visited-controller");
const router = express_1.default.Router();
const responseController = new response_controller_1.default();
// Route to handle user response (create/update response)
router.get('/handle-response/:id', responseController.handleResponse.bind(responseController));
// Route to fetch user responses
router.get('/user-responses/:studentNo', responseController.userResponse.bind(responseController));
router.get("/isVisited/user/:id", visited_controller_1.isVisited);
exports.default = router;
