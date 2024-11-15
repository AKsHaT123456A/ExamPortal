import { MongoDB } from "../db/db-connection";
import User_Test from "../models/user-model";

// Delete users with zero score and publish their IDs
const deleteZeroScoreUsers = async () => {
  try {
    console.log("Starting deletion process...");

    // Get the MongoDB connection
    const db = MongoDB.getInstance();
    await db.connect();

    // Find users with a score of 0
    const usersToDelete = await User_Test.find({ score: 0 });
    const userIds = usersToDelete.map((user) => user._id);

    if (userIds.length === 0) {
      console.log("No users found with score 0.");
      return;
    }

    // Delete the users
    await User_Test.deleteMany({ score: 0 });
    console.log(`Deleted ${userIds.length} users with score 0.`);

  } catch (error) {
    console.error("Error during deletion process:", error);
  } finally {
    // Disconnect from MongoDB
    MongoDB.getInstance().disconnect();
  }
};

// Run the workflow
deleteZeroScoreUsers();
