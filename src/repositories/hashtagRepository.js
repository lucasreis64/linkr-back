import connection from "../db/database.js";

async function deletePostHashtag(id) {
	return connection.query(`
    DELETE FROM posts_hashtags ph WHERE ph.post_id = $1`, [id]);
}

async function lessHashtag(id) {
	return connection.query(`
    UPDATE hashtags SET users = users - 1 
    WHERE hashtag 
    IN (SELECT hashtag FROM posts_hashtags WHERE post_id = $1)`, [id]);
}

async function getHashtag(hashtag) {
	return connection.query(`
    SELECT * FROM hashtags WHERE hashtag = $1`, [hashtag]);
}
async function plusHashtag(hashtag) {
	return connection.query(
        `UPDATE hashtags 
        SET users = users + 1 
        WHERE hashtag = $1`, 
        [hashtag]);
}
async function putHashtag(hashtag) {
	return connection.query(`
    INSERT INTO hashtags (hashtag) 
    VALUES ($1)`,
    [hashtag]);
}
async function putPostHashtag(hashtag, id) {
	return connection.query(`
    INSERT INTO posts_hashtags (hashtag, post_id) 
    VALUES ($1, $2)`,
    [hashtag, id]);
}

const hashtagRepository = {
    deletePostHashtag,
    lessHashtag,
    getHashtag,
    plusHashtag,
    putHashtag,
    putPostHashtag

}
export default hashtagRepository;