import connection from "../db/database.js";

export async function searchUser(name, requesterId) {
    const users = await connection.query(`SELECT u.id, u.username, u.profile_picture,
                                          COUNT(f.follower_id) AS is_followed
                                          FROM users u LEFT JOIN follows f
                                          ON f.follower_id=$2 AND f.followed_id=u.id
                                          WHERE username ILIKE $1
                                          GROUP BY u.id
                                          ORDER BY is_followed DESC`,[`%${name}%`, requesterId])
    return users.rows;
}   

export async function queryUserById(id) {
    const user = await connection.query(`SELECT * FROM users WHERE users.id=$1`, [id]);
    return user.rows;
}

export async function unfollowUser(id, requesterId) {

    const removal = await connection.query(`DELETE FROM follows WHERE
                                            follower_id=$1 AND followed_id=$2
                                            RETURNING *`, 
                                            [requesterId, id])
    return (removal.rows.length ? 200 : 404);
}

export async function followUser(id, requesterId) {

    const previous = await connection.query(`SELECT * FROM follows WHERE
                                             follower_id=$1 AND followed_id=$2`, 
                                            [requesterId, id])
    if(previous.rows.length)
        return 401;

    await connection.query(`INSERT INTO follows (follower_id, followed_id)
                            VALUES ($1, $2)`, [requesterId, id]);
    return 201;

}

export async function queryUserData(user, requesterId) {
    const posts = await connection.query(`SELECT u.username, u.profile_picture, COUNT(f.follower_id) AS is_following,
                                          ARRAY_AGG(json_build_object(
                                            'id', p.id,
                                            'link', p.link,
                                            'description', p.description,
                                            'created_at', p.created_at,
                                            'likes_users', COALESCE((SELECT 
                                                      ARRAY_AGG(l.user_id) FROM likes l
                                                      WHERE l.post_id=p.id), ARRAY[]::integer[])
                                          ) ORDER BY p.created_at DESC) AS user_posts 
                                          FROM users u LEFT JOIN posts p 
                                          ON p.user_id=$1
                                          LEFT JOIN follows f
                                          ON f.followed_id=$1 AND f.follower_id=$2
                                          WHERE u.id=$1
                                          GROUP BY u.id`, [user, requesterId]);
    if(posts.rows[0].user_posts[0].id === null)  
        posts.rows[0].user_posts = [];
    return posts.rows[0];
}