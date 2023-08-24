const User = require("../Models/user");

module.exports.socketSetup = (io) => {
    let leaderboardData = []; // Initialize leaderboard data

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
    setInterval(updateLeaderboardAndEmit, 10000);
};

module.exports.getLeaderboard = async(req,res)=>{
    try {
        const leaderboardData = await  await User.find().populate('responses').select('studentNo name calculatedTotalScore');
        return res.json(leaderboardData);
    } catch (error) {
        return res.status(500).json({ message: "Server error",error:error.message });
    }
}
