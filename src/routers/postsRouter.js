import express from 'express';
import  validateToken  from '../middlewares/validateToken.js';
import { publishPost, deletePost, updatePost, getTimeline } from '../controllers/postsController.js';
import deleteMiddleware from '../middlewares/deleteMiddleware.js';
import updateMiddleware from '../middlewares/updateMiddleware.js';

const router = express.Router();

router.post("/timeline", publishPost);
router.get("/timeline", validateToken, getTimeline);
router.delete("/delete/:id", validateToken, deleteMiddleware, deletePost);
router.put("/update/:id", validateToken, updateMiddleware, updatePost);

export default router;