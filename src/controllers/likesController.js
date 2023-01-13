import connection from "../db/database.js";

export async function postLike(req, res){
    const {post_id} = req.body;
    const user = res.locals.user;

    console.log(post_id);

    try {
        const likeExist = await connection.query(`
            SELECT * FROM likes WHERE post_id = $1`,[post_id]
        );
        

        if(likeExist?.rowCount > 0) {

            const userAlreadyLiked = [...likeExist.rows].some(i => i.user_id == user.id);

            console.log(userAlreadyLiked + " na lista de que já gostou")
            if(userAlreadyLiked){
                return res.sendStatus(202); 
            }
        }

        await connection.query(`
            INSERT INTO likes (user_id, post_id) 
            VALUES ($1, $2)`,
            [user.id, post_id]
        );

        res.sendStatus(201);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function removeLike(req, res) {
    const {post_id} = req.body;
    const user = res.locals.user;

    try {
        const likeExist = await connection.query(`
            SELECT * FROM likes WHERE post_id = $1`,[post_id]
        );
        
        console.log(likeExist);

        if(likeExist?.rowCount > 0) {

            console.log(likeExist.rows);

            const [{id}] = [...likeExist.rows].filter(i => i.user_id == user.id);

            if(!!id){
                await connection.query(`
                    DELETE FROM likes WHERE id = $1`,[id]
                );
            }
        }

        res.sendStatus(202);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}
