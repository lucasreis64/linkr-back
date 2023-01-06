import express from 'express';
import { searchUsers } from '../controllers/usersController.js';

const usersRouter = express.Router();

usersRouter.get("/search", searchUsers);

export default usersRouter;
