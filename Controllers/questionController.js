const Question = require("../Models/question");

const addquestions = async ({ body }, res) => {
    try {
        const responseData = body;
        const quesId = responseData.quesId;

        const quesExists = await Question.exists({ quesId });

        if (quesExists) {
            return res.status(409).json({ success: false, msg: "Question already exists" });
        }

        const totalCount = await Question.countDocuments();

        const result = await Question.create({ ...responseData, count: totalCount + 1 });

        const { correctId, ...info } = result._doc;

        return res.status(201).json({ success: true, msg: info });
    } catch (error) {
        return res.status(error.status || 500).json({ error: { message: error.message || "Internal Server Error" } });
    }
};

const getquestions = async (req, res) => {
    try {
        const data = await Question.find({}, { _id: 0, __v: 0 });

        if (!data || data.length === 0) {
            return res.status(404).json({ success: false, msg: "No questions found" });
        }

        return res.status(200).json({ success: true, msg: data });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ error: { message: "Internal Server Error" } });
    }
};

const deletequestion = async (req, res) => {
    try {
        const data = await Question.findByIdAndDelete(req.params.id);
        if (!data) return res.status(404).json({ success: false, msg: "Question not found" });
        return res.status(204).json({ msg: "Question has been deleted" });
    } catch (error) {
        return res.status(error.status || 500).json({ error: { message: error.message || "Internal Server Error" } });
    }
};

const updatequestion = async (req, res) => {
    try {
        const updatedData = await Question.findByIdAndUpdate(req.params.id, { $set: req.body });

        if (!updatedData) {
            return res.status(404).json({ success: false, msg: "Question not found" });
        }

        const { _id, correctId, ...info } = updatedData.toObject();

        return res.status(200).json({ success: true, msg: info });
    } catch (error) {
        throw error;
    }
};
const categoryquestion = async (req, res) => {
    try {
        const data = await Question.find({ category: req.params.key }, { __v: 0 });
        if (!data || data.length === 0) {
            return res.status(404).json({ success: false, msg: "Question not found" });
        }

        const formattedData = data.map((item) => {
            const { question, options, quesId, ansId, correctId, _id } = item;
            return { question, options, quesId, ansId, correctId, _id };
        });

        return res.status(200).json({
            success: true,
            msg: formattedData,
        });
    } catch (error) {
        const errorMessage = error.message || "Internal Server Error";
        const statusCode = error.status || 500;

        return res.status(statusCode).json({
            error: { message: errorMessage },
        });
    }
};


const countQuestion = async (req, res) => {
    try {
        const category = req.query.category;
        const count = await Question.find({category});
        return res.status(200).json({ success: true, msg: { count } });
    } catch (error) {
        return res.status(error.status || 500).json({ error: { message: error.message || "Internal Server Error" } });
    }
};

module.exports = {
    addquestions,
    getquestions,
    deletequestion,
    updatequestion,
    categoryquestion,
    countQuestion,
};
