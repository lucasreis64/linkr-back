import connection from "../db/database.js";
import { metadata } from "../services/getMetadataByLink.js";

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
    const user = res.locals.user;
    try {

        const { rows: foundPosts } = await connection.query(`
        SELECT p.*, u.username, u.profile_picture 
        FROM posts p
        JOIN posts_hashtags ph 
        ON ph.post_id = p.id
        JOIN users u
        ON p.user_id = u.id
        WHERE ph.hashtag = $1
        ORDER BY created_at DESC LIMIT 20
        `,
        [hashtag]);
        
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

            if(foundLikeUsers?.length > 0){  
                foundPosts[i].likes_users = foundLikeUsers.map(i => i.username);
            } 
            try {
                foundPosts[i].link_metadata = await metadata(foundPosts[i].link);
            }
            catch(e){
                console.log(e)
                foundPosts[i].link_metadata = {
                    title: "shared link in linkr",
                    image : "https://rafaturis.com.br/wp-content/uploads/2014/01/default-placeholder.png",
                    url: foundPosts[i].link,
                    description: "check this nice link shared in linkr!",
                    headline: ""
                };
                continue;
            }
        }
        

        res.status(200).send({data: foundPosts, loggedUser: user});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}