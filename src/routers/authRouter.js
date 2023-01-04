import express from 'express';
import { signUp, signIn } from '../controllers/authController.js';
import { validateSignIn } from '../middlewares/validateSignIn.js';
import { validateSignUp } from '../middlewares/validateSignUp.js';

const router = express.Router();

router.post("/signin", validateSignIn, signIn);
router.post("/signup", validateSignUp, signUp);

export default router;
