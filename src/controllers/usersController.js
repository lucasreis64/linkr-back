import { searchUser } from "../repositories/usersRepository";

export function searchUsers(req, res) {
    
    try { 
        const name = req.query.name;
        if(!name || name.lenght < 3)
            return res.sendStatus(422);

        const usersSuggestion = searchUser(name);
        return res.status(200).send(usersSuggestion);     
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500)
    }

}