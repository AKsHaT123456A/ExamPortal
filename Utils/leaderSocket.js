const { User } = require("../Models/user");

module.exports.socketSetup = (io) => {
    let leaderboardData = [];

    const updateLeaderboardAndEmit = async () => {
        try {
            const users = await User.find().populate('responses').select(' studentNo name userId');
            leaderboardData = users.map(user => {
                const calculatedTotalScore = user.responses.reduce((total, response) => total + response.score, 0);
                return {
                    studentNo: user.studentNo,
                    name: user.name,
                    calculatedTotalScore: calculatedTotalScore,
                    userId:user.userId

                };
            });
            leaderboardData.sort((a, b) => b.calculatedTotalScore - a.calculatedTotalScore);

            io.emit("leaderboard", leaderboardData);
        } catch (error) {
            console.error(error);
        }
    };

    io.on("connection", (socket) => {
        console.log("A user connected");

        socket.emit("leaderboard", leaderboardData);

        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });

    setInterval(() => {
        updateLeaderboardAndEmit();
    }, 10000);

    updateLeaderboardAndEmit();
};
