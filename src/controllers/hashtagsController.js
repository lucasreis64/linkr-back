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
    const hashtag = req.params.hashtag
    
    try {
        const result = await connection.query(`
            SELECT * FROM posts_hashtags AS ph
            WHERE ph.hashtag = $1
            JOIN posts AS p
            ON ph.post_id = p.id`,
            [hashtag]);

        return res.status(200).send(result.rows);
    } catch (err){
        console.log(err);
        return res.sendStatus(500);
    }
}