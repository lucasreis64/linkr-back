import connection from "../db/database.js";

async function deletePost(id) {
	return connection.query(
        `DELETE FROM posts WHERE id=$1`,
        [id]
    );
}

async function updatePost(link, description, id) {
	return connection.query(
        `UPDATE posts SET link = $1, description = $2 WHERE id = $3`,
        [link, description, id]
    );
}


const postRepository = {
	deletePost,
    updatePost,

}
export default postRepository;