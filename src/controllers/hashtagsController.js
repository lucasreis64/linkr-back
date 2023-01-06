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