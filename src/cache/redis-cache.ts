import { Redis } from "ioredis";
import { ICache } from "../services/i-cache-service";
import { QuestionData } from "../types/question-type-service";
import WebSocketServerSingleton from "../ws/socket-ws";

export class RedisCache implements ICache {
  private client: Redis;
  private static instance: RedisCache;
  private redisPublisher: Redis;
  private redisSubscriber: Redis;
  private wsServer = WebSocketServerSingleton.getInstance(); // For broadcasting leaderboard updates

  private constructor(redisUrl: string) {
    // Connect to Redis for publishing and subscribing
    this.client = new Redis(redisUrl);
    this.redisPublisher = new Redis(redisUrl); // Redis publisher
    this.redisSubscriber = new Redis(redisUrl); // Redis subscriber

    // Subscribe to the 'leaderboard' channel to listen for updates
    this.redisSubscriber.subscribe("leaderboard", (err, _count) => {
      console.log("Subscribed to leaderboard channel");

      if (err) {
        console.error("Failed to subscribe to leaderboard channel", err);
      }
    });

    // On receiving leaderboard updates from Redis, broadcast to WebSocket clients
    this.redisSubscriber.on("message", (channel, message) => {
      if (channel === "leaderboard") {
        this.wsServer.broadcast(message); // Broadcast to WebSocket clients
      }
    });
  }

  static getInstance(redisUrl: string): RedisCache {
    if (!this.instance) {
      this.instance = new RedisCache(redisUrl);
    }
    return this.instance;
  }

  public async get(
    userId: string,
  ): Promise<QuestionData | null> {
    try {
      const value = await this.client.get(userId);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error retrieving cache for${userId}:`, error);
      return null;
    }
  }
  public getQuestions(){
    return this.client.get("questions");
  }
  public setQuestions(questions:any[]){
    return this.client.set("questions",JSON.stringify(questions));
  }
  public async set(
    responses:any[],
    userId: string
  ): Promise<void> {
    try {
      const expirationTimeInSeconds = 3600*5;
      
      await this.client.set(
        userId,
        JSON.stringify(responses),
        "EX",
        expirationTimeInSeconds
      );
    } catch (error) {
      console.error(
        `Error setting cache for ${userId}:`,
        error
      );
    }
  }

  public async evict(quesId: string, userId: string): Promise<null> {
    try {
      const key = await this.generateKey(quesId, userId);
      await this.client.del(key);
      return null;
    } catch (error) {
      console.error(`Error evicting cache for ${quesId}:${userId}:`, error);
      return null;
    }
  }

  public async generateKey(quesId: string, userId: string): Promise<string> {
    return `${quesId}:${userId}`;
  }
  public async getTopPlayers(n: number) {
    try {
      // Retrieve the top players (userId and their score) from the leaderboard
      const topPlayers = await this.client.zrevrange(
        "leaderboard",
        0,
        n,
        "WITHSCORES"
      );

      const playerDetailsPromises = topPlayers.map(async (Member, index) => {
        const playerData = await this.client.hgetall(`user:${Member}`);

        return {
          userId: Member,
          score: parseInt(topPlayers[index + 1], 10),
          studentNo: playerData.studentNo,
          name: playerData.name,
        };
      });

      // Wait for all player details to be fetched
      const playersWithDetails = await Promise.all(playerDetailsPromises);

      return playersWithDetails;
    } catch (error) {
      console.error(`Error retrieving top ${n} players:`, error);
      return [];
    }
  }

  public async updatePlayerScore(
    playerScores: [
      {
        studentNo: string;
        calculatedTotalScore: number;
        name: string;
        userId: string;
      }
    ]
  ): Promise<void> {
    try {
      const pipeline = this.client.pipeline();
  
      playerScores.forEach(
        ({ userId, calculatedTotalScore, studentNo, name }) => {
          pipeline.zadd("leaderboard", calculatedTotalScore.toString(), userId);
  
          pipeline.hset(
            `user:${userId}`, 
            "studentNo", studentNo,
            "name", name
          );
        }
      );
  
      // Execute the pipeline
      await pipeline.exec();
  
      // Publish leaderboard update
      await this.publishLeaderboard();
    } catch (error) {
      console.error(`Error updating score for `, error);
    }
  }
  

  private async publishLeaderboard(): Promise<void> {
    try {
      const topPlayers = await this.getTopPlayers(10);
      await this.redisPublisher.publish(
        "leaderboard",
        JSON.stringify(topPlayers)
      );
    } catch (error) {
      console.error("Error publishing leaderboard:", error);
    }
  }



  public async clearLeaderboard(): Promise<void> {
    try {
      await this.client.del("leaderboard");
      await this.publishLeaderboard();
    } catch (error) {
      console.error("Error clearing leaderboard:", error);
    }
  }

  // Close Redis connections
  public close(): void {
    this.redisPublisher.quit();
    this.redisSubscriber.quit();
    this.client.quit();
  }
}
