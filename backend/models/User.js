const mongoose=require('mongoose')
const bcrypt=require("bcrypt")
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        unique:true,
        required:true,
        minlength:6

    },
    isVerified:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
})
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
        this.password=await bcrypt.hash(this.password,12)
    next()
});
module.exports=mongoose.model("user",userSchema)