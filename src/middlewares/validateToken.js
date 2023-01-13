import connection from "../db/database.js";

export default async function validateToken(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    console.log(authorization)
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
            `SELECT u.*, COUNT(f.follower_id) AS following_amount
            FROM users u LEFT JOIN follows f
            ON f.follower_id=$1
            WHERE u.id = $1
            GROUP BY u.id`,
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
