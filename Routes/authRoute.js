// const limiter = require("../utils/limiter");

const register = require("../Controllers/authController");


const router = require("express").Router();

router.post("/register",register);

module.exports = router;
