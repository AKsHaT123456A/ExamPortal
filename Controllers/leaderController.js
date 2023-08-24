const { getLeaderboard } = require("../Utils/leaderSocket");

const getLeaderboardData = async (req, res) => {
    try {
        const leaderboardData = await getLeaderboard();
        return res.json(leaderboardData);
    } catch (error) {
        return res.status(500).json({ message: "Server error",error:error.message });
    }
};

module.exports = getLeaderboardData;
