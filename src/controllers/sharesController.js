import sharesRepository from "../repositories/sharesRepository.js";
import postRepository from "../repositories/postRepository.js";

export async function postShare(req, res){
    const {post_id} = req.body;
    const user = res.locals.user;

    try {
        const shareExist = await sharesRepository.getSharesByPost(post_id);
        const post = await postRepository.getPost(post_id);
        if(!post.rows[0])
        {
            return res.sendStatus(404);
        }
        
        if(shareExist?.rowCount > 0) {

            const userAlreadyShared = [...shareExist.rows].some(i => i.user_id == user.id);

            if(userAlreadyShared){
                return res.sendStatus(202); 
            }

        }

        await sharesRepository.createShare(post_id, user.id);

        res.sendStatus(201);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function removeShare(req, res) {
    const {post_id} = req.body;
    const user = res.locals.user;

    try {
        const shareExist = await sharesRepository.getSharesByPost(post_id);
        const post = await postRepository.getPost(post_id);
        if(!post.rows[0])
        {
            return res.sendStatus(404);
        }

        if(shareExist?.rowCount > 0) {

            const [{id}] = [...shareExist.rows].filter(i => i.user_id == user.id);

            if(!!id){
                await sharesRepository.deleteShare(id);
            }

        }
        else
        {
            return res.status(409).send('nao tem share pra remover!');
        }

        res.sendStatus(202);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}