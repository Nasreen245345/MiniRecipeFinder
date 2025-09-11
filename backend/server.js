const express=require("express")
const mongoose=require("mongoose")
const authroutes=require("./routes/auth.js")
const publicroute=require("./routes/public.js")
const favouriteroute=require("./routes/favourites.js")
const cors=require("cors")
require("dotenv").config()
const app=express()
const connectDB=async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("mongoDB connect successfully")
    }catch(e){
        console.error("MongoDB connection errro",e.message)
        process.exit(1)
    }
}
connectDB()
app.use(express.json())
app.use("/api/auth",authroutes)
app.use("/api/public",publicroute)
app.use("/api/favourites",favouriteroute)
const port=process.env.PORT
app.listen(port,()=>{
    console.log("Server is running on port",port)
    
}) 