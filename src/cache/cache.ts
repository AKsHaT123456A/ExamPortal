import { ICache } from "../interfaces/i-cache-interface";
import { QuestionData } from "../types/question-type-service";
import { InMemoryCache } from "./inmemory-cache";
import { RedisCache } from "./redis-cache";

const redisUrl = process.env.REDIS_URL;

export class Cache implements ICache {
  private static instance: Cache;
  private delegate: ICache;

  private constructor() {
    if (redisUrl) {
      this.delegate = RedisCache.getInstance(redisUrl);
    } else {
      this.delegate = InMemoryCache.getInstance();
    }
  }

  static getInstance(): Cache {
    if (!this.instance) {
      this.instance = new Cache();
    }
    return this.instance;
  }

   public async set(
    responses:any[],
    userId: string
  ): Promise<void> {
    try {
      const expirationTimeInSeconds = 3600*5;
      await this.delegate.set(
        //@ts-ignore
        JSON.stringify(responses),
        userId,

      );
    } catch (error) {
      console.error(
        `Error setting cache for ${userId}:`,
        error
      );
    }
  }

  async get(quesId:string,userId:string): Promise<any> {
    return this.delegate.get(quesId,userId);
  }

  async evict(quesId:string,userId:string): Promise<null> {
    return this.delegate.evict(quesId,userId);
  }
}
export const cache = Cache.getInstance();