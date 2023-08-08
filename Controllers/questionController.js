const Question = require("../Models/question");
const addquestions = async ({ body }, res) => {
    try {
        const responseData = body;
        await questionResponse.create({ correctId: responseData.corId, quesId: responseData.quesId });
        let result = await Question.create(responseData);
        const { correctId, ...info } = result._doc;
        return res.status(201).json({ success: true, msg: info });
    } catch (error) {
        return createError.createErrorHandler(res, 500, error.message);
    }
};
const getquestions = async (req, res) => {
    try {
        const data = await Question.find({});
        if (!data) return createError("404", error.message);
        return res.status(201).json({ success: true, msg: data });
    } catch (error) {
        createError("500", error.message);
        return res.status(error.status || 500).json({ error: { message: error.message || "Internal Server Error" } });

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
        let data = await Question.findByIdAndUpdate(req.params.id, req.body);
        if (!data) return createError("404", error.message);
        const { correctId, ...info } = data;
        return res.status(204).json({ success: true, msg: info });
    } catch (error) {
        createError.createErrorHandler("500", error.message);
        return res.status(error.status || 500).json({ error: { message: error.message || "Internal Server Error" } });

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
module.exports = {
    addquestions,
    getquestions,
    deletequestion,
    updatequestion,
    categoryquestion,
    searchquestion,
};
