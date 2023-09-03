const csrf = require("csurf");
const register = require("../Controllers/authController");
const limiter = require("../middleware/limiter");
const browserOnlyMiddleware = require("../middleware/browserCheckMiddleware");

const csrfProtection = csrf();

const router = require("express").Router();
router.get("/preregistration", csrfProtection, (req, res) => {
    const csrfToken = req.csrfToken();
    res.json({ csrfToken });
});


router.post("/register", limiter, browserOnlyMiddleware, csrfProtection, register);
module.exports = router;
