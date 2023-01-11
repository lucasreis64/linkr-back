import { searchUser, queryUserById, queryUserData, followUser, unfollowUser } from "../repositories/usersRepository.js";
import { metadata } from "../services/getMetadataByLink.js";

export async function postFollow(req, res) {
    const { followedId } = req.params;
    if(followedId == res.locals.user.id)
        return res.sendStatus(401);
    return res.sendStatus(await followUser(followedId, res.locals.user.id))
}

export async function deleteFollow(req, res) {
    const { followedId } = req.params;
    if(followedId == res.locals.user.id)
        return res.sendStatus(401);
    return res.sendStatus(await unfollowUser(followedId, res.locals.user.id))
}

export async function searchUsers(req, res) {
    
    try { 
        const name = req.query.name;
        if(!name || name.lenght < 3)
            return res.sendStatus(422);
        const usersSuggestion = await searchUser(name, res.locals.user.id);
        return res.status(200).send(usersSuggestion);     
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500)
    }

}

export async function getUserData(req, res) {
    try {
        const { id } = req.params;
        const userRequesting = res.locals.user;
        
        const userExist = await queryUserById(id);
        if(!userExist.length)
            return res.sendStatus(404)

        const posts = await queryUserData(id, userRequesting.id);
        posts.is_following = (posts.is_following === '0' ? false : true)

        for(let i = 0; i < posts.user_posts.length; i++) 
            posts.user_posts[i]["link_metadata"] = await metadata(posts.user_posts[i].link)
        
        return res.status(200).send(posts);
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}