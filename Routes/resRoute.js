const { updateCategory, category } = require("../Controllers/catController");
const userResponseSend = require("../Controllers/getcontroller");
const { response, userResponse, isVisited } = require("../Controllers/responseController");

const router = require("express").Router();

router.get("/postResponse/:id", response);
router.get("/userResponse", userResponse);
router.get("/:id/:category", updateCategory);
router.get("/:id", category);
router.get("/isVisited/user/:id", isVisited);
router.get("/responses/ques/:id", userResponseSend);

module.exports = router;
