const { updateCategory, category } = require("../Controllers/catController");

const router = require("express").Router();

router.get("/user/:id/", updateCategory);


module.exports = router;
