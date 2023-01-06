import connection from "../db/database.js";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";

export async function signUp(req, res) {
    const { username, email, password, profile_picture } = req.body;

    try {
        const passwordHash = bcrypt.hashSync(password, 10);

        await connection.query(
            "INSERT INTO users (username, email, password, profile_picture) VALUES ($1, $2, $3, $4)",
            [username, email, passwordHash, profile_picture]
        );

        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

export async function signIn(req, res) {
    const { password, id } = res.locals.user;
    const user = req.body
    const token = uuidV4();
    
    try {
        if (user && bcrypt.compareSync(user.password, password)) {
            await connection.query(
                "INSERT INTO sessions (user_id, token) VALUES ($1, $2)",
                [id, token]
            );
            res.send({ token });
        } else {
            res.status(401).send("incorrect email or password");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}
