import express from "express";
import resRoute from "./response-route";
import catRoute from "./cat-route";
import quesRoute from "./question-route";
import authRoute from "./auth-route";
const router = express.Router();

// Registering routes with the main router
router.use(resRoute);
router.use(catRoute);
router.use(authRoute);
router.use(quesRoute);

export default router;
