const { response } = require("../Controllers/responseController");

const router = require("express").Router();

router.get("/postResponse/:id",response );

module.exports = router;
