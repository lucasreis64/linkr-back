import { searchUser, queryUserById, queryUserData } from "../repositories/usersRepository.js";

export async function searchUsers(req, res) {
    
    try { 
        const name = req.query.name;
        if(!name || name.lenght < 3)
            return res.sendStatus(422);

        const usersSuggestion = await searchUser(name);
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

        const userExist = await queryUserById(id);
        if(!userExist.length)
            return res.sendStatus(404)

        const posts = await queryUserData(id);
        return res.status(200).send(posts);
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}