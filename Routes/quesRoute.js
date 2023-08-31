const router = require("express").Router();

const {
    addquestions,
    getquestions,
    deletequestion,
    updatequestion,
    categoryquestion,
    searchquestion,
    countQuestion,
} = require("../Controllers/questionController");

router.post("/addquestions", addquestions);
router.get("/getquestions", getquestions);
router.delete("/:id", deletequestion);
router.patch("/questions/updatequestion/:id", updatequestion);
router.get("/search/:key", searchquestion);
router.get("/category/:key", categoryquestion);
router.get("/counts", countQuestion);

module.exports = router;
