import express from 'express';
import ResponseController from '../controllers/response-controller';
import { isVisited } from '../controllers/visited-controller';

const router = express.Router();
const responseController = new ResponseController();

// Route to handle user response (create/update response)
router.get('/handle-response/:id', responseController.handleResponse.bind(responseController));

// Route to fetch user responses
router.get('/user-responses/:studentNo', responseController.userResponse.bind(responseController));

router.get("/isVisited/user/:id", isVisited);

export default router;
