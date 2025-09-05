const jwt=require("jsonwebtoken")
require("dotenv").config()
const authMidddleware=(req,res,next)=>{
    const token=req.headers["authorization"]?.split(" ")[1]
    if(!token){
        return res.status(401).json({message:"Acces not allowed"})
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded
        next()
    }catch(e){
        return res.status(401).json({message:"invalid token"})
    }
}
module.exports=authMidddleware