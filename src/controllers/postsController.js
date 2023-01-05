import { connection } from "../db/database.js";

export async function publishPost(req, res){
    const {token, link, description} = req.body

    try {
        const result = await connection.query(`
            SELECT user_id FROM sessions WHERE token = $1`,[token]); 
        
        const userData = result.rows[0]

        await connection.query(`
            INSERT INTO posts (user_id, link, description) 
            VALUES ($1, $2, $3)`,
            [userData.user_id, link, description]);

        res.sendStatus(201)
    } catch (err){
        console.log(err);
        return res.sendStatus(500);
    }
}