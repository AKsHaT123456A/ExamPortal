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
        console.log(existingResponse);

        if (!existingResponse) {
            existingResponse = await questionResponse.create({
                ansStatus,
                score,
                quesId,
                ansId,
            });

            const user = await User.findById(id);
            user.responses.addToSet(existingResponse._id);
            console.log(user);

            await user.save();
            console.log("User saved successfully.");
        } else {
            existingResponse.ansStatus = ansStatus;
            existingResponse.score = score;
            await existingResponse.save();
        }

        console.log("Response saved successfully.");

        const user = await User.findById(id).populate({
            path: 'responses',
            select: 'ansStatus score quesId ansId'
        });

        return {
            message: existingResponse._id ? "Response updated successfully" : "Response recorded successfully",
            user: user.responses,
            calculatedTotalScore: user.calculatedTotalScore,
            category: user.category
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
