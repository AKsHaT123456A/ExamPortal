const category = require("../Controllers/catController");
const { response } = require("../Controllers/responseController");

const router = require("express").Router();

router.get("/postResponse/:id",response );
router.get("/:id/:category",category );

module.exports = router;
