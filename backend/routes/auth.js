const express=require("express")
const router=express.Router()
const User=require("../models/User.js")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const transporter=require("../config/email.js")
//signup route
router.post('/signup',async (req,res)=>{
      
    const{name,email,password}=req.body
   try{
     const existingUser=await User.findOne({email})
    if(existingUser){
        return res.status(400).json({message:"User with this email already exist"})
    }
        const newUser=new User({name,email,password})
        await newUser.save()
        const token=jwt.sign({id:newUser._id,name:newUser.name,email:newUser.email},process.env.JWT_SECRET,{expiresIn:"1d"})
         const verifyUrl = `${process.env.CLIENT_URL}/verify/${token}`;
         await transporter.sendMail({
            from:`"Nasreen" <${process.env.EMAIL_USER}>`,
            to:newUser.email,
            subject:"Verify your email",
           html: `<p>Hello, please verify your email by clicking <a href="${verifyUrl}">Here</a>.</p>`

         })
         return res.status(201).json({message:"Signup succesfull",user:{id:newUser._id,name:newUser.name,email:newUser.email}})

   }catch(e){
    console.error("Email send error:", e);
    res.status(500).json({message:'Server error',error:e.message})
   }
    
})
//verify token
router.get("/verify/:token",async(req,res)=>{
    try{
        const {token}=req.params
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    const user=await User.findById(decoded.id)
if(!user){
    return res.status(400).json({message:"Invalid token"})
}
if(user.isVerified){
    return res.status(400).json({message:"Email already verified"})
}
user.isVerified=true
await user.save()
return res.json({message:"Email verified succesfully now you can login"})
    }catch(err){
        console.error(err)
        res.status(400).json({message:"invalid or expire token"})
    }
})

//login route
router.post("/login",async(req,res)=>{
try{
    const {email,password}=req.body;
const user=await User.findOne({email})
if(!user){
    return res.status(400).json({message:"Invalid credentials"})
}
const isMatch=await bcrypt.compare(password,user.password)
if(!isMatch){
    return  res.status(400).json({message:"Invalid credentials"})
}
if(!user.isVerified){
    return res.status(401).json({message:"Please verify your email first"})
}
const token=jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:"1d"})
res.json({token,user:{id:user._id,name:user.name,email:user.email},message:"Login Succesful"})
}catch(e){
console.error(e)
res.status(500).json({message:"Server error"})
}
})

module.exports=router