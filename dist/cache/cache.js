"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = exports.Cache = void 0;
const inmemory_cache_1 = require("./inmemory-cache");
const redis_cache_1 = require("./redis-cache");
const redisUrl = process.env.REDIS_URL;
class Cache {
    constructor() {
        if (redisUrl) {
            this.delegate = redis_cache_1.RedisCache.getInstance(redisUrl);
        }
        else {
            this.delegate = inmemory_cache_1.InMemoryCache.getInstance();
        }
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new Cache();
        }
        return this.instance;
    }
    set(responses, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const expirationTimeInSeconds = 3600 * 5;
                yield this.delegate.set(
                //@ts-ignore
                JSON.stringify(responses), userId);
            }
            catch (error) {
                console.error(`Error setting cache for ${userId}:`, error);
            }
        });
    }
    get(quesId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.delegate.get(quesId, userId);
        });
    }
    evict(quesId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.delegate.evict(quesId, userId);
        });
    }
}
exports.Cache = Cache;
exports.cache = Cache.getInstance();
