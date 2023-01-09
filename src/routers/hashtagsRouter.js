import express from 'express';
import { rankTrendings, getByHashtag } from '../controllers/hashtagsController.js';
import  validateToken  from '../middlewares/validateToken.js';

const router = express.Router();

router.get("/trendings", rankTrendings);
router.get("/hashtag/:hashtag", validateToken, getByHashtag);

export default router;