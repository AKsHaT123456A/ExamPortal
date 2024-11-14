import express from 'express';
import { createTestUser } from '../controllers/auth-controller';
const router = express.Router();

router.get("/user-test", createTestUser);



export default router;
