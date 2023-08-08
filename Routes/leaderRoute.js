// routes.js
const express = require("express");
const getLeaderboardData = require("../Controllers/leaderController");

const router = express.Router();

router.get("/leaderboard", getLeaderboardData);

module.exports = router;
