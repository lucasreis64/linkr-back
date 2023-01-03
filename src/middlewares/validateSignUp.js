import { connection } from "../db/database.js";
import { signUpSchema } from "../models/signUpSchema.js";
import { validateBySchema } from "../services/validateBySchema.js";

export async function validateSignUp(req, res, next) {
    const { email } = req.body;
    if (!validateBySchema(req.body, res, signUpSchema)) return;
    try {
        const isExistentEmail = await connection.query(
            "SELECT * FROM users WHERE email = $1;",
            [email]
        );

        if (isExistentEmail.rows.length > 0) {
            res.sendStatus(409);
            return;
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}
