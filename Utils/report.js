const User = require("../Models/user");

const updateTotalScoreAndCounts = async (id, ansStatus, score) => {
    const user = await User.findById(id);
    try {
        if (!user) {
            return false;
        }

        let totalScore = 0;
        const counts = {
            markedUnanswered: 0,
            unanswered: 0,
            markedCorrect: 0,
            correct: 0,
            markedWrong: 0,
            wrong: 0,
        };
        switch (ansStatus) {
            case 3:
                counts.markedUnanswered++;
                break;
            case 0:
                counts.unanswered++;
                break;
            case 2:
                counts.markedCorrect++;
                totalScore += score;
                break;
            case 1:
                counts.correct++;
                totalScore += score;
                break;
            case -1:
                counts.markedWrong++;
                totalScore -= score;
                break;
            case -2:
                counts.wrong++;
                totalScore -= score;
                break;
            default:
                break;
        }
        counts.unanswered = 30 - (counts.markedCorrect + counts.correct + counts.markedWrong + counts.wrong);

        user.totalScore = totalScore;
        user.counts = counts;
        await user.save();
        return { totalScore: totalScore, counts: counts };
    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports = updateTotalScoreAndCounts;
