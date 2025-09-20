import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    profilePicture:{type:String,default:''},
    bio:{type:String,default:'Update your bio'},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    otp:{type:Number,default:0},
    expiredOtp:{type:Number,default:0}
})
const userModel= mongoose.models.user || mongoose.model("user",userSchema)
export default userModel;