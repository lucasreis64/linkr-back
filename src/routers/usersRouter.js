import express from 'express';
import { searchUsers } from '../controllers/usersController.js';
import { getUserData } from '../controllers/usersController.js';

const usersRouter = express.Router();

usersRouter.get("/search", searchUsers);
usersRouter.get('/users/:id', getUserData)

export default usersRouter;
