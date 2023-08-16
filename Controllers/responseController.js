const User = require('../Models/user');
const Question = require('../Models/question');
const questionResponse = require('../Models/questionResponse');
const updateTotalScoreAndCounts = require('../Utils/report');

// Add a caching layer
const cache = new Map();

// Function to fetch response from cache or database
const getResponseFromCacheOrDatabase = async (id, status, quesId, ansId) => {
    const cacheKey = `${id}_${status}_${ansId}`;
    const cachedResponse = cache.get(cacheKey);

    if (cachedResponse) {
        return cachedResponse;
    }

    // Fetch response from the database and update cache
    const response = await fetchResponseFromDatabase(id, status, quesId, ansId);
    cache.set(cacheKey, response);

    return response;
};

// Function to fetch response from the database
const fetchResponseFromDatabase = async (id, status, quesId, ansId) => {
    // Find the question based on quesId
    const ques = await Question.findOne({ quesId });
    if (!ques) {
        throw new Error('Question not found!');
    }

    const { correctId } = ques;
    let ansStatus, score;
    if (!ansId && status !== 0) {
        ansStatus = status === 1 ? 3 : 0; // Marked for review and unanswered or unanswered
        score = 0;
    } else if (ansId === correctId) {
        ansStatus = status + 1; // Correct answer
        score = 1;
    } else if (status === 1) {
        ansStatus = -1; // Wrong and marked for review
        score = 0;
    } else {
        ansStatus = -2; // Wrong answer
        score = 0;
    }

    const report = await updateTotalScoreAndCounts(id, ansStatus, score);
    if (!report) { return { message: "User not found" }; }

    let existingResponse = await questionResponse.findOne({ quesId: quesId });

    if (existingResponse) {
        existingResponse.ansStatus = ansStatus;
        existingResponse.score = score;
        await existingResponse.save();
    } else {
        existingResponse = await questionResponse.create({
            ansStatus: ansStatus,
            score: score,
            quesId: quesId,
        });

        await User.findByIdAndUpdate(id, {
            $push: { responses: existingResponse }
        }).populate({ path: "responses", select: "ansStatus score" });
    }
    const user = await User.findById(id).select("responses totalScore counts");
    return {
        message: existingResponse._id ? "Response updated successfully" : "Response recorded successfully",
        totalscore: report.totalScore,
        counts: report.counts,
        existingResponse: user
    };
};

module.exports.response = async (req, res) => {
    try {
        const { id } = req.params;
        const { ansId, status, quesId } = req.body;

        const response = await getResponseFromCacheOrDatabase(id, status, quesId, ansId);

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};
