import connection from "../db/database.js";

async function deletePost(id) {
	return connection.query(
        `DELETE FROM posts WHERE id=$1`,
        [id]
    );
}

async function getPost(id) {
	return connection.query(
        `SELECT * FROM posts WHERE id = $1`,[id]
    );
}

async function updatePost(link, description, id) {
	return connection.query(
        `UPDATE posts SET link = $1, description = $2 WHERE id = $3`,
        [link, description, id]
    );
}

async function getPostsTimeline(requesterId) {
	return await connection.query(
        `SELECT p.*, u.username, u.profile_picture,
        COUNT(f.followed_id) AS is_followed
        FROM posts p
        JOIN users u
        ON p.user_id=u.id
        JOIN follows f
        ON f.follower_id=$1 AND f.followed_id=p.user_id
        GROUP BY u.id, u.username, p.id, u.profile_picture
        ORDER BY p.created_at DESC`, [requesterId]);
}

async function getPostsShared(requesterId) {
	return await connection.query(
        `SELECT p.*, u2.username as "repostBy", u.username, u.profile_picture 
		FROM posts p 
		JOIN users u
        ON p.user_id = u.id
		JOIN shares s 
		ON s.post_id = p.id
		JOIN users u2
		ON s.user_id = u2.id
		JOIN follows f 
		ON f.followed_id = s.user_id
		WHERE f.follower_id = $1
		ORDER BY p.created_at DESC`, [requesterId]);
}

const postRepository = {
	deletePost,
    updatePost,
    getPostsTimeline,
    getPost,
    getPostsShared
}
export default postRepository;