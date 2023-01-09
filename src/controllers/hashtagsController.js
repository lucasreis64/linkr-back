import connection from "../db/database.js";

export async function rankTrendings(req, res){
    try {
        const rank = await connection.query(`
            SELECT * FROM "hashtags" ORDER BY users DESC LIMIT 10;`);

        return res.status(200).send(rank.rows);
    } catch (err){
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function getByHashtag(req, res){
    const { hashtag } = req.params
    
    try {
        const result = await connection.query(`
            SELECT * FROM posts AS p 
            JOIN posts_hashtags AS ph 
            ON ph.post_id = p.id 
            WHERE ph.hashtag = $1`,
            [hashtag]);

        return res.status(200).send(result.rows);
    } catch (err){
        console.log(err);
        return res.sendStatus(500);
    }
}