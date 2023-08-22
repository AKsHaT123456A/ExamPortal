const Question = require("../Models/question");
const addquestions = async ({ body }, res) => {
    try {
        const responseData = body;
        const quesId = responseData.quesId;

        const ques = await Question.findOne({ quesId });

        if (ques) {
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
        const data = await Question.find().select('question category options quesId count'); // Select only necessary fields
        if (!data) {
            return res.status(404).json({ success: false, msg: "No questions found" });
        }
        return res.status(200).json({ success: true, questions: data });
    } catch (error) {
        console.error("Error fetching questions:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const deletequestion = async (req, res) => {
    try {
        let data = await Question.findByIdAndDelete(req.params.id);
        if (!data) return createError("404", error.message);
        return res.status(204).json({ msg: "Question has been deleted" });
    } catch (error) {
        createError.createErrorHandler("500", error.message);
        return res.status(error.status || 500).json({ error: { message: error.message || "Internal Server Error" } });

    }
};
const updatequestion = async (req, res) => {
    try {
        const updatedData = await Question.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
        });

        if (!updatedData) {
            return res.status(404).json({ success: false, msg: "Question not found" });
        }

        const { correctId, ...info } = updatedData.toObject(); // Convert to object to remove Mongoose methods

        return res.status(200).json({ success: true, msg: info });
    } catch (error) {
        // Handle errors properly
        console.error(error); // Log the error for debugging purposes

        // Create an error handler instance
        const errorHandler = createError(500, error.message || "Internal Server Error");

        return res.status(errorHandler.status).json({
            error: { message: errorHandler.message },
        });
    }
};
const categoryquestion = async (req, res) => {
    try {
        let data = await Question.find({ category: req.params.key });
        if (!data) return createError("404", error.message);
        const { correctId, ...info } = data;
        return res.status(200).json({ success: true, msg: info });
    } catch (error) {
        createError.createErrorHandler("500", error.message);
        return res.status(error.status || 500).json({ error: { message: error.message || "Internal Server Error" } });

    }
};
const searchquestion = async (req, res) => {
    try {
        let data = await Question.find({
            $or: [{ question: { $regex: req.params.key } }],
        });
        if (!data) return createError("404", error.message);
        const { correctId, ...info } = data;
        return res.status(200).json({ success: true, msg: info });
    } catch (error) {
        createError.createErrorHandler("500", error.message);
        return res.status(error.status || 500).json({ error: { message: error.message || "Internal Server Error" } });
    }
};
const countQuestion = async (req, res) => {
    try {
        const category = req.query.category;
        const categoryResponse = await Question.find({ category });
        return res.status(200).json({ success: true, msg: { categoryResponse } });

    } catch (error) {
        return res.status(error.status || 500).json({ error: { message: error.message || "Internal Server Error" } });

    }
}
module.exports = {
    addquestions,
    getquestions,
    deletequestion,
    updatequestion,
    categoryquestion,
    searchquestion,
    countQuestion
};
