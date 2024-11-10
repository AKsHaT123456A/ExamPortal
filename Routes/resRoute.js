import userResponseSend from "../Controllers/getcontroller.js";
import { response, userResponse, isVisited } from "../Controllers/responseController.js";
import submitController from "../Controllers/submitController.js";
import express from "express";
const router = express.Router();
router.get("/postResponse/:id", response);
router.get("/userResponse", userResponse);
router.get("/isVisited/user/:id", isVisited);
router.get("/responses/ques/:id", userResponseSend);
router.get("/deleteVisited",submitController);

export default router;
