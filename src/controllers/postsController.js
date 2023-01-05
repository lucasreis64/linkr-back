import { connection } from "../db/database.js";

export async function publishPost(req, res){
    const post = req.body

    try {
        const result = await connection.query(`
            INSERT INTO posts (link, description, user_id) 
            VALUES ($1, $2, $3)`,
            [post.url, post.text, post.userId]);

        res.sendStatus(201)
    } catch (err){
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function getPosts(req, res){

    try {
        const { rows: result } = await connection.query(`
            SELECT * FROM posts 
            ORDER BY created_at DESC LIMIT 20`);

        res.status(200).send(result);
    } catch (err){
        console.log(err);
        return res.sendStatus(500);
    }
}