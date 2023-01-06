import express from 'express';
import { rankTrendings, getByHashtag } from '../controllers/hashtagsController.js';

const router = express.Router();

router.get("/trendings", rankTrendings);
router.get("/hashtag/:hashtag", getByHashtag);

export default router;