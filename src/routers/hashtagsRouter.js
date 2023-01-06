import express from 'express';
import { rankTrendings } from '../controllers/hashtagsController.js';

const router = express.Router();

router.get("/trendings", rankTrendings);

export default router;