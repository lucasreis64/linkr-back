import express from 'express';
import { publishPost } from '../controllers/postsController.js';

const router = express.Router();

router.post("/timeline", publishPost);

export default router;