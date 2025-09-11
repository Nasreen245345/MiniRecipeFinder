const mongoose=require("mongoose")
const publicSchema=new mongoose.Schema({
    idMeal:{
        type:String,
        index:true,
        required:true
    },
    strMeal:{
        type:String,
        index:true,
        required:true
    },
    strMealThumb:{
        type:String
    },
    strCategory:{
        type:String,
        index:true,
        required:true
    },
     strArea:{
        type:String,
        index:true,
        required:true
     },
     isFavourite:{
        type:Boolean,
        default:false
     },
     createdAt:{
        type:Date,
        default:Date.now(),
        index:true

     }
})
module.exports=mongoose.model("Recipes",publicSchema)