import connection from "../db/database.js";
import { signUpSchema } from "../models/signUpSchema.js";
import { validateBySchema } from "../services/validateBySchema.js";

export async function validateSignUp(req, res, next) {
    const { email, username } = req.body;
    if (!validateBySchema(req.body, res, signUpSchema)) return;
    try {
        const isExistentEmail = await connection.query(
            "SELECT * FROM users WHERE email = $1;",
            [email]
        );

        const isExistentUsername = await connection.query(
            "SELECT * FROM users WHERE username = $1;",
            [username]
        );

        if (isExistentEmail.rows.length > 0) {
            res.status(409).send('email já existente');
            return;
        }

        if (isExistentUsername.rows.length > 0) {
            res.status(409).send('nome de usuário já existente');
            return;
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}
