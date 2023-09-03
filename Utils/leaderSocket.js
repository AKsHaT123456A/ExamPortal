const { User } = require("../Models/user");

module.exports.socketSetup = (io) => {
    let leaderboardData = []; // Initialize leaderboard data

    const updateLeaderboardAndEmit = async (page = 1, itemsPerPage = 10) => {
        try {
            // Find all users
            const users = await User.find().populate('responses').select('studentNo name');

            // Calculate calculatedTotalScore for each user
            leaderboardData = users.map(user => {
                const calculatedTotalScore = user.responses.reduce((total, response) => total + response.score, 0);
                return {
                    studentNo: user.studentNo,
                    name: user.name,
                    calculatedTotalScore: calculatedTotalScore
                };
            });

            // Sort by calculatedTotalScore in descending order
            leaderboardData.sort((a, b) => b.calculatedTotalScore - a.calculatedTotalScore);

            // Calculate start and end indices for pagination
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;

            const pageData = leaderboardData.slice(startIndex, endIndex);

            io.emit("leaderboard", pageData);
        } catch (error) {
            console.error(error);
        }
    };

    io.on("connection", (socket) => {
        console.log("A user connected");

        socket.emit("leaderboard", leaderboardData);

        socket.on("page", (page, itemsPerPage) => {
            updateLeaderboardAndEmit(page, itemsPerPage);
        });

        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });

    // Simulate leaderboard updates every few seconds
    setInterval(updateLeaderboardAndEmit, 10000);
};
