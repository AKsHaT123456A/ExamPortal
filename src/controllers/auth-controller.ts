import User_Test from "../models/user-model";
import { faker } from "@faker-js/faker";

//@ts-ignore
export const createTestUser = async (_req, res) => {
    const name = faker.person.fullName();
    const studentNo = Math.floor(10000 + Math.random() * 9000000);
    const password = `${name.split(' ')[0]}@${studentNo}`;

    try {
        // Find the most recently created user by sorting by createdAt
        const latestUser = await User_Test.findOne().sort({ createdAt: -1 });

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
                    logintime:0,

                    //@ts-ignore
                    createdAt: latestUser.createdAt,
                    _id: latestUser._id
                });
            }
        }

        // If no user exists or the latest user is older than 5 hours, create a new user
        const testUser = new User_Test({
            name,
            studentNo,
            password,
            logintime: 0,
            isRelogin: false,
            isSubmit: false,
        });

        await testUser.save();

        return res.status(201).json({
            studentNo,
            password,
            isSubmit: false,
            logintime:0,
            //@ts-ignore
            createdAt: testUser.createdAt,
            _id: testUser._id
        });
    } catch (error) {
        console.error("Error creating or fetching test user:", error);
        return res.status(500).json({ error: "Failed to create or fetch test user" });
    }
};
