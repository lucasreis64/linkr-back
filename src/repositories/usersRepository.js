import connection from "../db/database";

export function searchUser(name) {
    const users = await connection.query(`SELECT id,username, profile_picture
                                          FROM USERS WHERE
                                          username ILIKE $1`, ['%' + name + '%'])
    return users.rows;
}