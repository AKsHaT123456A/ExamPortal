const User = require("../Models/user");

module.exports.socketSetup = (io) => {
    let leaderboardData = []; // Initialize leaderboard data

    const updateLeaderboardAndEmit = async () => {
        try {
            leaderboardData = await User.find({}, 'studentNo name calculatedTotalScore').sort({ totalScore: -1 });
            io.emit("leaderboard", leaderboardData);
        } catch (error) {
            console.error(error);
        }
    };

    io.on("connection", (socket) => {
        console.log("A user connected");

        // Send initial leaderboard data to the client
        socket.emit("leaderboard", leaderboardData);

        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });

    // Simulate leaderboard updates every few seconds
    setInterval(updateLeaderboardAndEmit, 5000);
};
