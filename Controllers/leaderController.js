const { getLeaderboard } = require("../Utils/leaderSocket");

const getLeaderboardData = async (req, res) => {
    try {
        const leaderboardData = await getLeaderboard();
        return res.json(leaderboardData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = getLeaderboardData;
