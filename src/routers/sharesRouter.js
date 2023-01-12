import express from 'express';
import validateToken from '../middlewares/validateToken.js';
import { postShare, removeShare } from '../controllers/sharesController.js';

const router = express.Router();

router.post("/timeline/share", validateToken, postShare);
router.post("/timeline/removeshare", validateToken, removeShare);

export default router;