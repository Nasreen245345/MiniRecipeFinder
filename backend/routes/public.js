const express=require("express")
const router=express.Router()
const Recipe=require("../models/Public")
router.get("/",async (req,res)=>{
    try{
        const recipes=await Recipe.find()
        res.status(200).json(recipes)
    }catch(e){
        res.status(500).json({message:"Erroe while fetching recipes",error:e.message})
    }

})
module.exports=router
