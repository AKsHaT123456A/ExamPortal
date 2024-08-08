const userResponseSend = require("../Controllers/getcontroller");
const { response, userResponse, isVisited } = require("../Controllers/responseController");
const submitController = require("../Controllers/submitController");
const router = require("express").Router();

router.get("/postResponse/:id", response);
router.get("/userResponse", userResponse);
router.get("/isVisited/user/:id", isVisited);
router.get("/responses/ques/:id", userResponseSend);
router.get("/deleteVisited",submitController);

module.exports = router;
