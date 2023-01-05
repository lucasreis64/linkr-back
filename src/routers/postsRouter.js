import express from 'express';
import { publishPost, getPosts } from '../controllers/postsController.js';

const router = express.Router();

router.post("/timeline", publishPost);
router.get("/timeline", getPosts);

export default router;