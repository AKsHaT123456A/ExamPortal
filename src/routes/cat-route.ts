import express from 'express';
import { updateCategory } from '../controllers/cat-controller';
const router = express.Router();

router.get("/user/:id/", updateCategory);



export default router;
