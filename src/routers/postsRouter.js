import express from 'express';
import { publishPost } from '../controllers/postsController';

const router = express.Router();

router.post("/timeline", publishPost);

export default router;