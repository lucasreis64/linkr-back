import connection from "../db/database.js";
import postRepository from "../repositories/postRepository.js";
import hashtagRepository from "../repositories/hashtagRepository.js";
import likesRepository from "../repositories/likesRepository.js";
import extract from "mention-hashtag";
import { metadata } from "../services/getMetadataByLink.js";

export async function publishPost(req, res){
    const {token, link, description} = req.body

    try {
        const userExist = await connection.query(`
            SELECT user_id FROM sessions WHERE token = $1`,[token]);

        const userData = userExist?.rows[0]
        const result = await connection.query(`
            INSERT INTO posts (user_id, link, description) 
            VALUES ($1, $2, $3) RETURNING id`,
            [userData.user_id, link, description]);

        const { id } = result.rows[0]

        const hashtags = extract(description, { symbol: false, unique: true, type: '#' });
        if(hashtags != []){
            for(let i = 0; i < hashtags.length; i++){
                const hashtag = await hashtagRepository.getHashtag(hashtags[i]);

                if(hashtag.rows[0]){
                    await hashtagRepository.plusHashtag(hashtags[i]);
                } else {
                    await hashtagRepository.putHashtag(hashtags[i]);
                }
                await hashtagRepository.putPostHashtag(hashtags[i], id);
            }
        }

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
            ORDER BY created_at DESC LIMIT 10`);

        if (foundPosts?.length === 0) {
            return res.sendStatus(200);
        }

        for(let i = 0; i < foundPosts?.length; i++){

            const { rows: foundLikes } = await likesRepository.getLikesNumberPost(foundPosts[i].id);
            
            const {likes_count} = foundLikes[0];

            if(foundLikes?.length > 0){
                foundPosts[i].likes_count = likes_count;
            } 
            
            const { rows: foundLikeUsers } = await likesRepository.getLikesUsersPost(foundPosts[i].id);

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

export async function updatePost(req, res) {
    try {       
        const { link, description } = req.body;
        const id = req.params.id;
        const hashtags = extract(description, { symbol: false, unique: true, type: '#' });

        await hashtagRepository.lessHashtag(id);
        await hashtagRepository.deletePostHashtag(id);
        
        if(!hashtags)
        {
            await postRepository.updatePost(link, description, id);
        }
        else
        {
            for(let i = 0; i < hashtags.length; i++)
            {
                const hashtag = await hashtagRepository.getHashtag(hashtags[i]);

                if(hashtag.rows[0])
                {
                    await hashtagRepository.plusHashtag(hashtags[i]);
                }
                else
                {
                    await hashtagRepository.putHashtag(hashtags[i]);

                }
                await hashtagRepository.putPostHashtag(hashtags[i], id);
            }
            await postRepository.updatePost(link, description, id);
        }
        
        return res.status(204).send('update com sucesso');

    } catch (error) {
        console.log(error);
        return res.status(500).send('Não foi possível conectar ao servidor!');
    }  
};

export async function deletePost(req, res) {
    try { 
        const id = req.params.id;

        await hashtagRepository.lessHashtag(id);
        await hashtagRepository.deletePostHashtag(id);
        await postRepository.deletePost(id);
          
        return res.status(204).send('Deletado com sucesso');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Não foi possível conectar ao servidor!');
    }  
};