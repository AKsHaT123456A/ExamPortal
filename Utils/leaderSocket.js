const { User } = require("../Models/user");

module.exports.socketSetup = (io) => {
    let leaderboardData = []; // Initialize leaderboard data
    let currentPage = 1;
    const itemsPerPage = 2; // Show 10 records per page

    const updateLeaderboardAndEmit = async () => {
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
        } catch (error) {
            console.error(error);
        }
    };

    const sendPageData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageData = leaderboardData.slice(startIndex, endIndex);

        io.emit("leaderboard", pageData);
    };

    io.on("connection", (socket) => {
        console.log("A user connected");

        socket.emit("leaderboard", leaderboardData);

        socket.on("page", (page) => {
            currentPage = page;
            sendPageData();
        });

        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });

    // Simulate leaderboard updates every few seconds
    setInterval(() => {
        updateLeaderboardAndEmit();
        sendPageData(); // Send the current page data after updating the leaderboard
    }, 10000);

    // Initial leaderboard and page data setup
    updateLeaderboardAndEmit();
    sendPageData();
};
