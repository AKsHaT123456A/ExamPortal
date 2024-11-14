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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestUser = void 0;
const user_model_1 = __importDefault(require("../models/user-model"));
const faker_1 = require("@faker-js/faker");
//@ts-ignore
const createTestUser = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = faker_1.faker.person.fullName();
    const studentNo = Math.floor(10000 + Math.random() * 9000000);
    const password = `${name.split(' ')[0]}@${studentNo}`;
    try {
        // Find the most recently created user by sorting by createdAt
        const latestUser = yield user_model_1.default.findOne().sort({ createdAt: -1 });
        // If a user is found, check if the createdAt is within the last 5 hours (18000 seconds)
        if (latestUser) {
            const currentTime = new Date();
            //@ts-ignore
            const userCreatedTime = new Date(latestUser.createdAt);
            const timeDifference = (currentTime.getTime() - userCreatedTime.getTime()) / 1000; // Difference in seconds
            // If the user was created within the last 5 hours
            if (timeDifference < 18000) {
                return res.status(200).json({
                    studentNo: latestUser.studentNo,
                    password: latestUser.password,
                    isSubmit: false,
                    logintime: 0,
                    //@ts-ignore
                    createdAt: latestUser.createdAt,
                    _id: latestUser._id
                });
            }
        }
        // If no user exists or the latest user is older than 5 hours, create a new user
        const testUser = new user_model_1.default({
            name,
            studentNo,
            password,
            logintime: 0,
            isRelogin: false,
            isSubmit: false,
        });
        yield testUser.save();
        return res.status(201).json({
            studentNo,
            password,
            isSubmit: false,
            logintime: 0,
            //@ts-ignore
            createdAt: testUser.createdAt,
            _id: testUser._id
        });
    }
    catch (error) {
        console.error("Error creating or fetching test user:", error);
        return res.status(500).json({ error: "Failed to create or fetch test user" });
    }
});
exports.createTestUser = createTestUser;
