import connection from "../db/database.js";

export async function publishPost(req, res){
    const {token, link, description} = req.body

    try {
        const userExist = await connection.query(`

            SELECT user_id FROM sessions WHERE token = $1`,[token]);

        if(userExist.rowCount == 0) {
            return res.status(401).send("Algo deu errado, tente novamente!")
        }
        const userData = userExist.rows[0]

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