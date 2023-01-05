import express from 'express';
import { publishPost, getTimeline } from '../controllers/postsController.js';

const router = express.Router();

router.post("/timeline", publishPost);
router.get("/timeline", getTimeline);

export default router;