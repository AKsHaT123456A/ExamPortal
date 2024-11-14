import { Leaderboard } from "../types/leaderboard-type";
import WebSocketServerSingleton from "../ws/socket-ws";
import { RedisCache } from "../cache/redis-cache";
import constants from "../config/constants";
import User_Test from "../models/user-model";

const wsServer = WebSocketServerSingleton.getInstance();
wsServer.start();

export class LeaderboardServiceSingleton {
  private static instance: LeaderboardServiceSingleton;
  private leaderboardData: Leaderboard = [];

  private constructor() {}

  public static getInstance(): LeaderboardServiceSingleton {
    if (!LeaderboardServiceSingleton.instance) {
      LeaderboardServiceSingleton.instance = new LeaderboardServiceSingleton();
    }
    return LeaderboardServiceSingleton.instance;
  }

  public async updateAndEmit(
    users: any[],
    userType: "admin" | "normal"
  ): Promise<void> {
    try {
      const redisCache = RedisCache.getInstance(
        constants.REDIS_URL || "redis://localhost:6379"
      );

      // Process each user's score and prepare data for bulk update
      const playerScores = users
        .map((user) => {
          const calculatedTotalScore =
            userType === "admin"
              ? user.responses.reduce(
                  (total: number, response: { score: number }) =>
                    total + response.score,
                  0
                )
              : null;

          if (calculatedTotalScore !== null) {
            return {
              studentNo: user.studentNo,
              calculatedTotalScore: calculatedTotalScore,
              name: user.name,
              userId: user._id.toString(),
            };
          }
          return null;
        })
        .filter((score) => score !== null); // Filter out null entries

      // Bulk update player scores using the pipeline method
      if (playerScores.length > 0) {
        await redisCache.updatePlayerScore(
          playerScores as [
            {
              studentNo: string;
              calculatedTotalScore: number;
              name: string;
              userId: string;
            }
          ]
        );
      } else {
        console.log("No player scores to update.");
      }

      // Prepare data for local leaderboardData
      users.forEach((user) => {
        const calculatedTotalScore =
          userType === "admin"
            ? user.responses.reduce(
                (total: number, response: { score: number }) =>
                  total + response.score,
                0
              )
            : 0;

        this.leaderboardData.push({
          studentNo: user.studentNo,
          name: user.name,
          calculatedTotalScore: calculatedTotalScore,
          userId: user._id.toString(),
        });
      });

      // Sort leaderboard locally (useful for fallback or other purposes)
      this.leaderboardData.sort((a, b) => {
        return (b.calculatedTotalScore || 0) - (a.calculatedTotalScore || 0);
      });
      const topPlayers = await redisCache.getTopPlayers(10);
      wsServer.broadcast(JSON.stringify(topPlayers));
    } catch (error: any) {
      console.error("Error updating and emitting leaderboard:", error);
    }
  }
  public async updateLeaderboardData() {
    const users = await User_Test.find()
      .populate("responses")
      .select(" studentNo name userId");
    const redisCache = RedisCache.getInstance(
      constants.REDIS_URL || "redis://localhost:6379"
    );

    // Process each user's score and prepare data for bulk update
    const playerScores = users
      .map((user) => {
        const calculatedTotalScore = user.responses.reduce(
          (total: number, response: { score: number }) =>
            total + response.score,
          0
        );

        if (calculatedTotalScore !== null) {
          return {
            studentNo: user.studentNo,
            calculatedTotalScore: calculatedTotalScore,
            name: user.name,
            userId: user._id.toString(),
          };
        }
        return null;
      })
      .filter((score) => score !== null); // Filter out null entries

    // Bulk update player scores using the pipeline method
    if (playerScores.length > 0) {
      await redisCache.updatePlayerScore(
        playerScores as [
          {
            studentNo: string;
            calculatedTotalScore: number;
            name: string;
            userId: string;
          }
        ]
      );
    } else {
      console.log("No player scores to update.");
    }

    // Prepare data for local leaderboardData
    users.forEach((user) => {
      const calculatedTotalScore = user.responses.reduce(
        (total: number, response: { score: number }) => total + response.score,
        0
      );

      this.leaderboardData.push({
        studentNo: user.studentNo,
        name: user.name,
        calculatedTotalScore: calculatedTotalScore,
        userId: user._id.toString(),
      });
    });

    // Sort leaderboard locally (useful for fallback or other purposes)
    this.leaderboardData.sort((a, b) => {
      return (b.calculatedTotalScore || 0) - (a.calculatedTotalScore || 0);
    });
    const topPlayers = await redisCache.getTopPlayers(10);
    wsServer.broadcast(JSON.stringify(topPlayers));
  }
}
