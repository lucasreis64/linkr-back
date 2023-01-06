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

export async function updatePost(req, res) {
    try {
        
        const { link, description} = req.body
        const id = req.params.id;

        await connection.query(
            `UPDATE posts SET link = $1, description = $2 WHERE id = $3`,
            [link, description, id]
        );
          
        return res.status(204).send('update com sucesso');

    } catch (error) {
        console.log(error);
        return res.status(500).send('Não foi possível conectar ao servidor!');
    }  
};

export async function deletePost(req, res) {
    try {
        
        const id = req.params.id;

        await connection.query(
            `DELETE FROM posts WHERE id=$1`,
            [id]
        );
          
        return res.status(204).send('Deletado com sucesso');

    } catch (error) {
        console.log(error);
        return res.status(500).send('Não foi possível conectar ao servidor!');

    }  
};