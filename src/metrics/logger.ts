import leaderBoardQueue from "../services/queue-service";

export function loggerTest() {
    leaderBoardQueue.on("completed", (job) => {
        console.log(`Job with ID ${job.id} completed successfully.`);
    });

    leaderBoardQueue.on("failed", (job, error) => {
        console.error(`Job with ID ${job.id} failed with error: ${error.message}`);
    });
}

