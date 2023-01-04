import { connection } from "../db/database.js";

export async function publishPost(req, res){
    const post = req.body

    try {
        const result = await connection.query(`
            INSERT INTO posts (url, text, "userId", likes) 
            VALUES ($1, $2, $3, $4)`,
            [post.url, post.text, post.userId, 0]);

        res.sendStatus(201)
    } catch (err){
        console.log(err);
        return res.sendStatus(500);
    }
}