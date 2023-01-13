import connection from "../db/database.js";

export async function findAll(req, res) {
    const post_id = req.params.id;

    try {
        let comments = await connection.query(
            `SELECT u.profile_picture, u.username, content
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE "post_id" = $1`,
            [post_id]
        );
        console.log(comments.rows);
        res.send(comments.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}

export async function postComment(req, res) {
    const { post_id, content } = req.body;
    let { user } = res.locals;

    try {
        await connection.query(
            "INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3);",
            [user.id, post_id, content]
        );
        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}
