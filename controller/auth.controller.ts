import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { validateRegister, validateLogin } from '../schemas/schemas.js';
import { Request, Response } from 'express';
import { KanbanDB } from '../model/db-kanban.js';


dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY ?? '123456'


export class AuthController {

    static async login (req: Request, res: Response) {

        const validateRequest = validateLogin(req.body)
    
        if (validateRequest.error) {
            return res.status(400).json({ error: JSON.parse(validateRequest.error.message) })
        }
    
        const user : UserLogin = req.body;
        
        const username = await KanbanDB.searchUser(user.username)

        if ('message' in username) { return res.status(username.code).send(username.message)}
        if (username.username == '') { return res.status(401).send('Incorrect username or password')}

        const pass = await KanbanDB.getPassword(username.username)

        if ('message' in pass) { return res.status(pass.code).send(pass.message)}

        if (!await bcrypt.compare(user.passwd, pass.passwd)) { return res.status(401).send('Incorrect username or password')}
    
        const user_id = await KanbanDB.getID(username.username)

        if ('message' in user_id) { return res.status(user_id.code).send(user_id.message)}
    
        const token = jwt.sign( { user_id: user_id.id}, 
                                SECRET_KEY,
                                {
                                    expiresIn: '5h'
                                })
    
        res.cookie('access_token', token, { httpOnly : true, sameSite : 'strict'}).send( { user_id: user_id, token } )
    }

    static async register (req: Request, res: Response) {

        const validateRequest = validateRegister(req.body)
    
        if (validateRequest.error) {
            return res.status(400).json({ error: JSON.parse(validateRequest.error.message) })
        }
    
        const user: User = req.body
    
        const username = await KanbanDB.searchUser(user.username)
        
        if ('message' in username) { return res.status(username.code).send(username.message)}
        if (username.username !== '') { return res.status(401).send('Username already exists')}
    
        const hashedPasswd = await bcrypt.hash(user.passwd, 7)
        const created_user = await KanbanDB.addUser(user.username, hashedPasswd, user.email)

        if ('message' in created_user) { return res.status(created_user.code).send(created_user.message)}

        res.send(created_user)
    }
    
    static async logout (req: Request, res: Response)  {
        res.clearCookie('access_token').json({message : 'Logout successful'})
    }


}