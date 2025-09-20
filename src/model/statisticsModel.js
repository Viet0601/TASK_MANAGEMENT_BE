import mongoose from "mongoose";
const statisticsSchema=new mongoose.Schema({
    total:{type:Number,default:0},
    done:{type:Number,default:0},
    pending:{type:Number,default:0},
    low:{type:Number,default:0},
    medium:{type:Number,default:0},
    high:{type:Number,default:0},
    owner:{type:mongoose.Schema.Types.ObjectId,ref:"users",required:true},
})
const statisticsModel= mongoose.models.statistic || mongoose.model("statistic",statisticsSchema)
export default statisticsModel;