import { connection } from "../db/database.js";

export default async function validateToken(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send("missing token");
    }

    try {
        let session = await connection.query(
            "SELECT * FROM sessions WHERE token = $1;",
            [token]
        );

        session = session?.rows[0];
    
        if (!session) {
            res.sendStatus(401);
            return;
        }
        
        let user = await connection.query(
            "SELECT * FROM users WHERE id = $1;",
            [session.user_id]
        )

        user = user?.rows[0];

        if(!user){
            res.status(422).send('invalid token')
            return
        }

        delete user.password;

        res.locals.user = user;

        next();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}
