import csrf from "csurf";
import register from "../Controllers/authController.js";
import limiter from "../middleware/limiter.js";
import verify from "../Controllers/verifycontroller.js";
import registerDecrypt from "../Controllers/authController.js";

const csrfProtection = csrf({ cookie: true });
import express from "express";
const router = express.Router();
router.get("/preregistration", csrfProtection, (req, res) => {
    const csrfToken = req.csrfToken();
    res.json({ csrfToken });
});
router.post("/register", limiter, register);
router.post("/Decregister", limiter, registerDecrypt);
router.get("/verify/:id", verify);
export default router;
