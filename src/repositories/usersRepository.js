import connection from "../db/database.js";

export async function searchUser(name) {
    const users = await connection.query(`SELECT id,username, profile_picture
                                          FROM users WHERE username ILIKE $1`,[`%${name}%`])
    return users.rows;
}

export async function queryUserById(id) {
    const user = await connection.query("SELECT * FROM users WHERE id=$1", [id]);
    return user.rows;
}

export async function queryUserData(user) {
    const posts = await connection.query(`SELECT u.username, u.profile_picture,
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
                                          WHERE u.id=$1
                                          GROUP BY u.id`, [user]);
    if(posts.rows[0].user_posts[0].id === null)  
        posts.rows[0].user_posts = [];
    return posts.rows[0];
}