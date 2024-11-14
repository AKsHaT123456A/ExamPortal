import User from "../models/user-model";
import { Leaderboard } from "../types/leaderboard-type";
import WebSocketServerSingleton from "../ws/socket-ws";

const wsServer = WebSocketServerSingleton.getInstance();
wsServer.start();

let leaderboardData: Leaderboard = [];

export const updateLeaderboardAndEmit = async () => {
  try {
    const users = await User.find()
      .populate("responses")
      .select(" studentNo name userId");
    leaderboardData = users.map((user: any) => {
      const calculatedTotalScore = user.responses.reduce(
        (total: any, response: { score: any }) => total + response.score,
        0
      );

      return {
        studentNo: user.studentNo,
        name: user.name,
        calculatedTotalScore: calculatedTotalScore,
        userId: user.userId,
      };
    });
    leaderboardData.sort(
      (
        a: { calculatedTotalScore: number },
        b: { calculatedTotalScore: number }
      ) => b.calculatedTotalScore - a.calculatedTotalScore
    );
    wsServer.broadcast(JSON.stringify(leaderboardData));
  } catch (error) {
    console.error(error);
  }
};
