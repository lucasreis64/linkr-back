import express from 'express';
import { validateToken } from '../middlewares/validateToken.js';
import { publishPost, getTimeline } from '../controllers/postsController.js';

const router = express.Router();

router.post("/timeline", publishPost);
router.get("/timeline", validateToken, getTimeline);

export default router;