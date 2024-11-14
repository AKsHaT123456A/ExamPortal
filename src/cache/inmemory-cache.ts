import { QuestionData } from "../types/question-type-service";
import { ICache } from "../services/i-cache-service";

interface ICacheEntry {
  response: any[];
  expiry: number;
}

export class InMemoryCache implements ICache {
  private inMemoryDb: Map<string, ICacheEntry>;
  private static instance: InMemoryCache;

  private constructor() {
    this.inMemoryDb = new Map<string, ICacheEntry>();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new InMemoryCache();
    }
    return this.instance;
  }

  async set(
    response:any[],
    userId: string,
  ): Promise<void> {
    let expirySeconds = 60 * 60; // 1 hour
    this.inMemoryDb.set(userId, {
      response,
      expiry: new Date().getTime() + expirySeconds * 1000,
    });
  }

  async get(quesId: string, userId: string): Promise<any> {
    const key = this.generateKey(quesId, userId);
    const entry = this.inMemoryDb.get(key);
    if (!entry) {
      return null;
    }
    if (new Date().getTime() > entry.expiry) {
      this.inMemoryDb.delete(key);
      return null;
    }
    return entry.response;
  }

  async evict(quesId: string, userId: string): Promise<null> {
    const key = this.generateKey(quesId, userId);
    this.inMemoryDb.delete(key);
    return null;
  }

  private generateKey(quesId: string, userId: string): string {
    return `${quesId}:${userId}`;
  }
}
