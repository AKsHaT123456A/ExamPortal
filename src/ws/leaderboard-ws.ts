import { log } from "console";
import { LeaderboardServiceSingleton } from "../services/leaderboard-service";

const leaderboardService = LeaderboardServiceSingleton.getInstance();

export const leaderboardServiceUserType = async (
  user:any[],
  userId: "admin" | "normal"
) => {
  log(`Fetching leaderboard data for user type: ${userId}`);
  await leaderboardService.updateAndEmit(user,userId);
};


