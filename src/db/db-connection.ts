import mongoose, { Connection } from "mongoose";
import { CustomError } from "../error/custom-error";
import questionResponse from "../models/question-response-model";
import constants from "../config/constants";

export class MongoDB {
  private static instance: MongoDB | null = null;
  private dbUri: string;

  private constructor() {
    this.dbUri =
      constants.MONGODB_URI || "mongodb://localhost:27017/";
  }

  public static getInstance(): MongoDB {
    if (!MongoDB.instance) {
      MongoDB.instance = new MongoDB();
    }
    return MongoDB.instance;
  }

  public async connect(): Promise<void> {

    try {
      
      await mongoose.connect(this.dbUri);
      await questionResponse.find();
      console.log("MongoDB connected successfully");
    } catch (error) {
      //@ts-ignore
      throw new CustomError("Error connecting to MongoDB: " + error.message);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log("MongoDB disconnected");
    } catch (error) {
      console.error("Error disconnecting from MongoDB:", error);
    }
  }

  public getConnection(): Connection {
    return mongoose.connection;
  }
}

export default MongoDB.getInstance();
