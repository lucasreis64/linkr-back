import cors from "cors";
import express, { json } from "express";
import dotenv from 'dotenv'
import authRouter from './routers/authRouter.js';
import postsRouter from './routers/postsRouter.js';
import usersRouter from "./routers/usersRouter.js";
import hashtagsRouter from './routers/hashtagsRouter.js';
import likesRouter from './routers/likesRouter.js';
import sharesRouter from './routers/sharesRouter.js';
import commentsRouter from './routers/commentsRouter.js';


dotenv.config();

const app = express();
app.use(cors());
app.use(json());

app.use(authRouter);
app.use(postsRouter);
app.use(usersRouter)
app.use(hashtagsRouter);
app.use(likesRouter);
app.use(sharesRouter);
app.use(commentsRouter);

app.listen(process.env.PORT || 5000, ()=>{
    console.log("Running on port " + process.env.PORT)
})
