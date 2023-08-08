const { response } = require("../controllers/responseController");

const router = require("express").Router();

router.get("/postResponse/:id",response );

module.exports = router;
