import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser";
import { connectDB } from "./src/config/coonectDB.js";
import cors from "cors"
import initWebRoute from "./src/route/apiRoute.js";
import cookieParser from "cookie-parser";
dotenv.config() 
const PORT= process.env.PORT || 3000;
const app= express();
app.use(cors({ origin: [`${process.env.FE_URL}`,'http://localhost:5173'], credentials: true }))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({
    extended:true
})) 

await connectDB() 
app.get("/",(req,res)=>{
    res.send("API is working ")
})
initWebRoute(app)
app.listen(PORT,()=>{
    console.log("Dang chay tren cong: ",PORT)
    
})

