import express from 'express';
import { findAll, postComment } from '../controllers/commentsController.js';
import  validateToken  from '../middlewares/validateToken.js';

const router = express.Router();

router.get("/comments/:id", validateToken, findAll);
router.post("/comments", validateToken, postComment);

export default router;