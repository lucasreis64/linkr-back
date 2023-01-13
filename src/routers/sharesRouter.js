import express from 'express';
import validateToken from '../middlewares/validateToken.js';
import { postShare, removeShare, getShare } from '../controllers/sharesController.js';

const router = express.Router();

router.post("/timeline/share/:post_id", validateToken, postShare);
router.get("/timeline/share/:post_id", getShare);
router.post("/timeline/removeshare/:post_id", validateToken, removeShare);

export default router;