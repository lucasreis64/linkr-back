import express from 'express';
import { validateToken } from '../middlewares/validateToken.js';
import { postLike, removeLike } from '../controllers/likesController.js';

const router = express.Router();

router.post("/timeline/like", validateToken, postLike);
router.post("/timeline/dislike", validateToken, removeLike);

export default router;