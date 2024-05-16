import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const comparePasswords = (password,hash) =>{
    return bcrypt.compare(password,hash)
}

export const hashPassword = (password) => {
    return bcrypt.hash(password,5)
}

export const createJWT = (user) => {
    const token = jwt.sign({ id: user.id, username: user.email }, process.env.JWT_SECRET)
    console.log(token,'return form jwt')
    return token
}


export const protect = (req,res,next) =>{
    const bearer = req.headers.authorization

    if(!bearer){
        res.status(401)
        res.json({message:'Not Token Found!!'})
        return
    }

    const [,token] = bearer.split(' ')

    if (!token){
        res.status(401)
        res.json({message:'Not a Valid Token!!'})
        return
    }

    try{
        const user = jwt.verify(token,process.env.JWT_SECRET)
        req.user = user
        next()
    }catch(e){
        console.error(e);
        if (e instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: "Token has expired" });
        } else if (e instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: e.message });
        } else {
            res.status(401).json({ message: "Not a valid token" });
        }
        return;
    }

}