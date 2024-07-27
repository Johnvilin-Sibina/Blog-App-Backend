import jwt from 'jsonwebtoken'
import { errorHandler } from '../Utils/Error.js'


export const verifyToken = (req,res,next)=>{
    const token = req.cookies.access_Token
    console.log(token)
    if(!token){
        return next(errorHandler(401,'Unauthorized Access'))
    }
    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,user)=>{
       if(err){
        return next(errorHandler(401,'Unauthorized Access'))
       }
       req.user = user;
       next() 
    })
}