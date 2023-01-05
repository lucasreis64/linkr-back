import cors from "cors";
import express, { json } from "express";
import dotenv from 'dotenv'
import authRouter from './routers/authRouter.js';
import postsRouter from './routers/postsRouter.js';
import usersRouter from "./routers/usersRouter.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

app.use(authRouter);
app.use(postsRouter);
app.use(usersRouter)

app.listen(process.env.PORT, ()=>{
    console.log("Running on port " + process.env.PORT)
})
