import statisticsModel from "../model/statisticsModel.js";

export const getAllDataTask=async(req,res)=>{
    try {
        const _id= req.body._id || '';
        if(!_id)
        {
            return res.status(401).json({success:false,message:"Không xác thực được người dùng!"})
        }
        const statistics= await statisticsModel.findOne({owner:_id});
        return res.status(200).json({
            success:true,
            data:statistics
        })

    } catch (error) {
        console.log(error)
    }
}