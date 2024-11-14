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
exports.InMemoryCache = void 0;
class InMemoryCache {
    constructor() {
        this.inMemoryDb = new Map();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new InMemoryCache();
        }
        return this.instance;
    }
    set(response, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let expirySeconds = 60 * 60; // 1 hour
            this.inMemoryDb.set(userId, {
                response,
                expiry: new Date().getTime() + expirySeconds * 1000,
            });
        });
    }
    get(quesId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    evict(quesId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this.generateKey(quesId, userId);
            this.inMemoryDb.delete(key);
            return null;
        });
    }
    generateKey(quesId, userId) {
        return `${quesId}:${userId}`;
    }
}
exports.InMemoryCache = InMemoryCache;
