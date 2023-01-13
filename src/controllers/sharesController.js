import sharesRepository from "../repositories/sharesRepository.js";
import postRepository from "../repositories/postRepository.js";

export async function getShare(req, res){
    const post_id = req.params.post_id;

    try {
        const shares = await sharesRepository.getSharesUsersPost(post_id);

        return res.status(201).send(shares.rows);

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function postShare(req, res){
    const post_id = req.params.post_id;
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
    const post_id = req.params.post_id;
    const user = res.locals.user;

    try {
        const shareExist = await sharesRepository.getSharesByPost(post_id);
        const post = await postRepository.getPost(post_id);
        if(!post.rows[0])
        {
            return res.sendStatus(404);
        }

        if(shareExist?.rowCount > 0) 
        {  

            await sharesRepository.deleteShare(user.id, post_id);

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