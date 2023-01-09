import connection from "../db/database.js";

async function deleteLike(id) {
	return connection.query(
        `DELETE FROM likes WHERE id = $1`,[id]
    );
}

async function createLike(post_id, user_id) {
	return connection.query(
        `INSERT INTO likes (user_id, post_id) 
            VALUES ($1, $2)`,
            [user_id, post_id]
    );
}

async function getLikesByPost(post_id) {
	return connection.query(
        `SELECT * FROM likes WHERE post_id = $1`,[post_id]
    );
}

async function getLikesNumberPost(post_id) {
	return connection.query(
        `SELECT 
            COUNT(l.id) AS "likes_count"
        FROM posts p
            LEFT JOIN likes l
                ON l.post_id = p.id
        WHERE p.id = $1`, [post_id]);
}


async function getLikesUsersPost(post_id) {
	return connection.query(
        `SELECT DISTINCT
            u.username
        FROM likes l
            JOIN users u
                ON l.user_id = u.id
            JOIN posts p
                ON l.post_id = p.id
        WHERE p.id = $1`, [post_id]);
}

const likesRepository = {
    createLike,
	deleteLike,
    getLikesByPost,
    getLikesUsersPost,
    getLikesNumberPost
}
export default likesRepository;