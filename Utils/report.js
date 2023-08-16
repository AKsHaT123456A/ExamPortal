const User = require("../Models/user");

const updateTotalScoreAndCounts = async (id, oldAnsStatus, newAnsStatus) => {
    const user = await User.findById(id);

    try {
        if (!user) {
            return false;
        }

        const counts = {
            markedUnanswered: 0,
            unanswered: 0,
            markedCorrect: 0,
            correct: 0,
            markedWrong: 0,
            wrong: 0,
        };

        // Decrement old count based on oldAnsStatus
        switch (oldAnsStatus) {
            case 3:
                counts.markedUnanswered--;
                break;
            case 0:
                counts.unanswered--;
                break;
            case 2:
                counts.markedCorrect--;
                break;
            case 1:
                counts.correct--;
                break;
            case -1:
                counts.markedWrong--;
                break;
            case -2:
                counts.wrong--;
                break;
            default:
                break;
        }

        // Increment new count based on newAnsStatus
        switch (newAnsStatus) {
            case 3:
                counts.markedUnanswered++;
                break;
            case 0:
                counts.unanswered++;
                break;
            case 2:
                counts.markedCorrect++;
                break;
            case 1:
                counts.correct++;
                break;
            case -1:
                counts.markedWrong++;
                break;
            case -2:
                counts.wrong++;
                break;
            default:
                break;
        }

        counts.unanswered = 30 - (counts.markedCorrect + counts.correct + counts.markedWrong + counts.wrong);

        return { counts: counts };
    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports = updateTotalScoreAndCounts;
