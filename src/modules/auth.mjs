import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const comparePasswords = (password) =>{
    
}

export const createJWT = (user) => {
    const token = jwt.sign({ id: user.id, username: user.email }, process.env.JWT_SECRET)
    return token
}


export const protect = (req,res) =>{
    const bearer = req.headers.authorization

    if(!bearer){
        res.status(401)
        res.json({message:'Not Token Found!!'})
        return
    }

    const [,token] = bearer.split(' ')

    if (!token){
        res.stats(401)
        res.json({message:'Not a Valid Token!!'})
        return
    }

    try{
        const user = jwt.verify(token,process.env.JWT_SECRET)
        req.user = user
        next()
    }catch(e){
        console.error(e)
        res.status(401)
        res.json({message:"NOT A VALID TOKEN"})
        return
    }

}