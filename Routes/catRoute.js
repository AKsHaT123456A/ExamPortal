import { updateCategory } from "../Controllers/catController.js";

import express from "express";
const router = express.Router();
router.get("/user/:id/", updateCategory);


export default router;
