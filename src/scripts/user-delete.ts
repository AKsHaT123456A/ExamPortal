import mongoose from "mongoose";
import { MongoDB } from "../db/db-connection";
import User_Test from "../models/user-model";

// Delete users with zero score and publish their IDs
const deleteZeroScoreUsers = async () => {
  try {
    console.log("Starting deletion process...");
    const databaseUri = process.env.MONGODB_URI;
    if (!databaseUri) {
      console.error("DATABASE_URL is not set");
      process.exit(1);
    }
  
    await mongoose.connect(databaseUri);
    console.log("MongoDB connected successfully");

    // // Delete the users
    await User_Test.deleteMany({ $or: [
      { responses: { $exists: false } },
      { responses: { $size: 0 } }       
  ]});
  
      console.log("Deletion process completed successfully");
  } catch (error) {
    console.error("Error during deletion process:", error);
  } finally {
    // Disconnect from MongoDB
    MongoDB.getInstance().disconnect();
  }
};

// Run the workflow
deleteZeroScoreUsers();
