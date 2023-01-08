import  connection  from "../db/database.js";
import Joi from "joi"; 

export default async function updateMiddleware(req, res, next) 
{
    try {
        const id = req.params.id;
        const { link, description } = req.body;

        const updateSchema = Joi.object({
            link: Joi.string(),
            description: Joi.string()
        });

        const validation = updateSchema.validate(req.body, { abortEarly: true });
        if (validation.error) 
        {
            const errors = validation.error.details.map((detail) => detail.message);
            return res.status(422).send({ errors });
        };
        if(!description || !link)
        {
            return res.status(409).send('Seu post nao pode ficar vazio!'); 
        } 
        const url = await connection.query(
            `SELECT * FROM posts WHERE id = $1`,
            [id]
        );
        if(!url.rows[0])
        {
            return res.status(404).send('post nao existe'); 
        }
        if(url.rows[0].user_id !== res.locals.user.id)
        {
            return res.status(401).send('Delete não autorizado!');
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
        
  }