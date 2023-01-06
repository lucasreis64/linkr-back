import express from 'express';
import { publishPost, deletePost, updatePost } from '../controllers/postsController.js';
import auth from '../middlewares/validateToken.js';
import deleteMiddleware from '../middlewares/deleteMiddleware.js';
import updateMiddleware from '../middlewares/updateMiddleware.js';

const router = express.Router();

router.post("/timeline", publishPost);
router.delete("/delete/:id", auth, deleteMiddleware, deletePost);
router.put("/update/:id", auth, updateMiddleware, updatePost);

export default router;