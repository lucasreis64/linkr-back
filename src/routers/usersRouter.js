import express from 'express';
import { deleteFollow, searchUsers } from '../controllers/usersController.js';
import { getUserData } from '../controllers/usersController.js';
import validateToken from '../middlewares/validateToken.js';
import { postFollow } from '../controllers/usersController.js';

const usersRouter = express.Router();

usersRouter.get("/search", validateToken, searchUsers);
usersRouter.get('/users/:id', validateToken, getUserData)
usersRouter.post('/follow/:followedId', validateToken, postFollow)
usersRouter.delete('/follow/:followedId', validateToken, deleteFollow)

export default usersRouter;
