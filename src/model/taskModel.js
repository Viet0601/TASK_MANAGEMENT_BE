import mongoose from "mongoose";
const taskSchema=new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,default:''},
    priority:{type:String,enum:["Low","Medium","High"],default:"Low"},
    dueDate:{type:Date,required:true},
    owner:{type:mongoose.Schema.Types.ObjectId,ref:"users",required:true},
    completed:{type:Boolean,default:false}, 
    completedAt:{type:Date,default:null},
    createdAt:{type:Date,default:Date.now()}
}, { timestamps: true })
const taskModel= mongoose.models.task || mongoose.model("task",taskSchema)
export default taskModel;