import { connection } from "../db/database.js";
import { metadata } from "../services/getMetadataByLink.js";

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
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function getTimeline(req, res) {
    const user = res.locals.user;

    try {
        const { rows: foundPosts } = await connection.query(`
           SELECT 
                p.id,
                p.link,
                p.description,
                p.created_at,
                p.user_id,
                u.username,
                u.profile_picture
            FROM posts p
                JOIN users u
                    ON p.user_id = u.id
            ORDER BY created_at DESC LIMIT 20`);

        if (foundPosts?.length === 0) {
            return "Não há posts ainda."
        }

        for(let i = 0; i < foundPosts?.length; i++){
            const { rows: foundLikes } = await connection.query(`
                SELECT 
                    COUNT(l.id) AS "likes_count"
                FROM posts p
                    LEFT JOIN likes l
                        ON l.post_id = p.id
                WHERE p.id = $1`, [foundPosts[i].id]);
            
            const {likes_count} = foundLikes[0];

            if(foundLikes?.length > 0){
                foundPosts[i].likes_count = likes_count;
            } 

            const { rows: foundLikeUsers } = await connection.query(`
                SELECT DISTINCT
                    u.username
                FROM likes l
                    JOIN users u
                        ON l.user_id = u.id
                    JOIN posts p
                        ON l.post_id = p.id
                WHERE p.id = $1`, [foundPosts[i].id]);

            foundPosts[i].likes_users = [];

            console.log(foundLikeUsers)

            if(foundLikeUsers?.length > 0){  
                foundPosts[i].likes_users = foundLikeUsers.map(i => i.username);
            } 

            foundPosts[i].link_metadata = await metadata(foundPosts[i].link);

            

        }


        res.status(200).send({data: foundPosts, loggedUser: user});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}