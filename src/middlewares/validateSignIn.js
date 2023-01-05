import { signInSchema } from "../models/signInSchema.js";
import connection from "../db/database.js";
import { validateBySchema } from "../services/validateBySchema.js";

export async function validateSignIn(req, res, next) {
    const { email } = req.body;
    if (!validateBySchema(req.body, res, signInSchema)) return;

    try {
        const user = await connection.query(
            "SELECT * FROM users WHERE email = $1;",
            [email]
        );
        
        if (user.rows.length === 0) {
            res.sendStatus(401);
            return;
        }
        res.locals.user = user.rows[0]
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}
