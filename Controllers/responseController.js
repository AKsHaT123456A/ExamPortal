const User = require('../Models/user');
const Question = require('../Models/question');
const questionResponse = require('../Models/questionResponse');

const fetchResponseFromDatabase = async (id, status, quesId, ansId) => {
    try {
        const ques = await Question.findOne({ quesId });
        if (!ques) {
            throw new Error('Question not found!');
        }

        const { correctId } = ques;
        const ansStatusMapping = {
            0: ansId === correctId ? 2 : -1,
            1: ansId === correctId ? 3 : -2, // Marked
        };

        const ansStatus = ansStatusMapping[status] || 0;
        const score = ansStatus === 2 || ansStatus === 3 ? 1 : 0;

        let existingResponse = await questionResponse.findOne({ quesId });

        if (!existingResponse) {
            existingResponse = await questionResponse.create({
                ansStatus,
                score,
                quesId,
                ansId,
                category: ques.category
            });

            const user = await User.findById(id);
            user.responses.addToSet(existingResponse._id);
            user.calculatedTotalScore += score; // Update total score
            user.category = ques.category; // Update category
            await user.save();
        } else {
            const user = await User.findById(id);

            // Calculate score change and update total score
            const oldScore = existingResponse.score;
            const scoreChange = score - oldScore;
            existingResponse.score = score;

            user.calculatedTotalScore += scoreChange;
            await Promise.all([existingResponse.save(), user.save()]);
        }

        const userWithResponses = await User.findById(id).populate({
            path: 'responses',
            select: 'ansStatus score quesId ansId category -_id'
        });

        return {
            message: existingResponse._id ? "Response updated successfully" : "Response recorded successfully",
            user: userWithResponses.responses,
            calculatedTotalScore: userWithResponses.calculatedTotalScore,
            category: userWithResponses.category
        };
    } catch (error) {
        throw error;
    }
};

module.exports.response = async (req, res) => {
    try {
        const { id } = req.params;
        const { ansId, status, quesId } = req.query;
        const response = await fetchResponseFromDatabase(id, status, quesId, ansId);

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};

module.exports.userResponse = async (req, res) => {
    const { id } = req.query;
    try {
        const user = await User.findById(id).populate({
            path: 'responses',
            select: 'ansStatus score quesId ansId -_id'
        });
        return res.status(200).json({ responses: user.responses });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};
