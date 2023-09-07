const { updateCategory, category } = require("../Controllers/catController");

const router = require("express").Router();

router.get("/:id/:category", updateCategory);
router.get("/:id", category);


module.exports = router;
