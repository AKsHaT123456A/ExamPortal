const router = require("express").Router();

const {
    addquestions,
    getquestions,
    deletequestion,
    updatequestion,
    categoryquestion,
    countQuestion,
} = require("../Controllers/questionController");

router.post("/addquestions", addquestions);
router.get("/getquestions", getquestions);
router.delete("/deletequestions/:id", deletequestion);
router.patch("/updatequestion/:id", updatequestion);
router.get("/category/:key", categoryquestion);
router.get("/counts", countQuestion);

module.exports = router;
