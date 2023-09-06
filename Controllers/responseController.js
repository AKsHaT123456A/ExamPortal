const { User } = require('../Models/user');
const Question = require('../Models/question');
const questionResponse = require('../Models/questionResponse');
const visited = require('../Models/visited');
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
        console.log(ansStatus);
        const userId = id;
        let existingResponse = await questionResponse.findOne({ quesId, userId });
        console.log(existingResponse);
        if (!existingResponse) {
            existingResponse = await questionResponse.create({
                ansStatus,
                score,
                quesId,
                ansId,
                category: ques.category,
                userId
            });

            const user = await User.findById(id);
            console.log(existingResponse._id);
            user.responses.addToSet(existingResponse._id);
            console.log(user.responses)

            user.calculatedTotalScore += score; // Update total score
            user.category = ques.category; // Update category
            await user.save();
        } else {
            const user = await User.findById(id);

            // Calculate score change and update total score
            const oldScore = existingResponse.score;
            const scoreChange = score - oldScore;
            existingResponse.score = score;
            existingResponse.ansStatus = ansStatus;
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

module.exports.isVisited = async (req, res) => {
    const { id } = req.params;
    const { category, quesId } = req.query;

    try {
        const foundVisited = await visited.findOne({ userId: id, category, quesId, isVisited: true });
        if (foundVisited) return res.status(400).json({ "message": "Already visited" });
        const [createdVisit, foundVisit] = await Promise.all([
            visited.create({ userId: id, category, quesId, isVisited: true }),
            visited.find({ userId: id, isVisited: true })
        ]);

        if (foundVisit) {
            res.status(200).json(foundVisit);
        } else {
            res.status(404).json({ message: 'Visit not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}