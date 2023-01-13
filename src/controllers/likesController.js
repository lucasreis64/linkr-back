import likesRepository from "../repositories/likesRepository.js";

export async function postLike(req, res){
    const {post_id} = req.body;
    const user = res.locals.user;

    try {
        const likeExist = await likesRepository.getLikesByPost(post_id);
        
        if(likeExist?.rowCount > 0) {

            const userAlreadyLiked = [...likeExist.rows].some(i => i.user_id == user.id);

            if(userAlreadyLiked){
                return res.sendStatus(202); 
            }
        }

        await likesRepository.createLike(post_id, user.id);

        res.sendStatus(201);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function removeLike(req, res) {
    const {post_id} = req.body;
    const user = res.locals.user;

    try {
        const likeExist = await likesRepository.getLikesByPost(post_id);

        if(likeExist?.rowCount > 0) {

            const [{id}] = [...likeExist.rows].filter(i => i.user_id == user.id);

            if(!!id){
                await likesRepository.deleteLike(id);
            }
        }

        res.sendStatus(202);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}
