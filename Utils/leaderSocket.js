const User = require("../Models/user");

// Function to retrieve leaderboard data
const getLeaderboard = async () => {
    try {
        const users = await User.find({}, "name totalScore").sort({ totalScore: -1 });
        return users;
    } catch (error) {
        console.log(error);
        return [];
    }
};

// Function to emit leaderboard data to connected clients
const updateLeaderboard = async (io) => {
    const users = await getLeaderboard();
    io.emit("leaderboard", users);
};

module.exports = { getLeaderboard, updateLeaderboard };
