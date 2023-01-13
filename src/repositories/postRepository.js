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

async function getPostsTimeline(link, description, id) {
	return connection.query(
        `SELECT 
        p.id,
        p.link,
        p.description,
        p.created_at,
        p.user_id,
        u.username,
        u.profile_picture
            FROM posts p
                JOIN users u
                    ON p.user_id = u.id
            ORDER BY created_at DESC LIMIT 20`);
}


const postRepository = {
	deletePost,
    updatePost,
    getPostsTimeline,
    getPost
}
export default postRepository;