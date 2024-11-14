import Bull from "bull";
import { LeaderboardServiceSingleton } from "../services/leaderboard-service";
import { log } from "console";
import constants from "../config/constants";

class LeaderboardQueueSingleton {
  private static instance: Bull.Queue;

  private constructor() {}

  public static getInstance(): Bull.Queue {
    if (!LeaderboardQueueSingleton.instance) {

      LeaderboardQueueSingleton.instance = new Bull(
        "leaderboardQueue",
        constants.REDIS_URL || "redis://localhost:6379",
        {
          defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: {
              count: 3,
            },
          },
        }
      );
      log("Leaderboard queue created");
      // Define the queue's job processing function
      LeaderboardQueueSingleton.instance.process(async (job) => {
        const { users, userType } = job.data;
        const leaderboardService = LeaderboardServiceSingleton.getInstance();
        await leaderboardService.updateAndEmit(users, userType);
      });
      // Add event listeners for job completion and failure
      LeaderboardQueueSingleton.instance.on("completed", (job) => {
        console.log(`Job with ID ${job.id} completed successfully.`);
      });

      LeaderboardQueueSingleton.instance.on("failed", (job, error) => {
        console.error(
          `Job with ID ${job.id} failed with error: ${error.message}`
        );
      });
    }

    return LeaderboardQueueSingleton.instance;
  }
}

// Export the singleton instance function
export default LeaderboardQueueSingleton.getInstance();
