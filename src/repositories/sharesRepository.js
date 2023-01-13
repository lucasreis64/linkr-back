import connection from "../db/database.js";

async function deleteShare(id) {
	return connection.query(
        `DELETE FROM shares WHERE id = $1`,[id]
    );
}

async function createShare(post_id, user_id) {
	return connection.query(
        `INSERT INTO shares (user_id, post_id) 
            VALUES ($1, $2)`,
            [user_id, post_id]
    );
}

async function getSharesByPost(post_id) {
	return connection.query(
        `SELECT * FROM shares WHERE post_id = $1`,[post_id]
    );
}


async function getSharesUsersPost(post_id) {
	return connection.query(
        `SELECT DISTINCT
            u.username
        FROM shares s
            JOIN users u
                ON s.user_id = u.id
            JOIN posts p
                ON s.post_id = p.id
        WHERE p.id = $1`, [post_id]);
}

const sharesRepository = {
    createShare,
	deleteShare,
    getSharesByPost,
    getSharesUsersPost,
}
export default sharesRepository;