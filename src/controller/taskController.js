import statisticsModel from "../model/statisticsModel.js";
import taskModel from "../model/taskModel.js";


export const createTaskController=async(req,res)=>{
    try {
        const {title,description,priority,dueDate}= req.body || {};
        const _id = req.body._id ;
        if(!title || !priority || !dueDate)
        {
             return res.status(400).json({
                 success:false,
                 message:"Vui lòng điền đủ thông tin!"

        })
        }
        if(!_id)
        {
             return res.status(401).json({
                 success:false,
                 message:"Không xác thực được người dùng!"

        })
        }
        const task= await taskModel.create({title,description,priority,dueDate,owner:_id,createdAt: new Date(Date.now() + Math.floor(Math.random() * 1000))})
        const statistic = await statisticsModel.findOne({owner:_id});
        statistic.total=statistic.total+1;
        statistic.pending=statistic.pending+1;
        if(priority==="High") statistic.high=statistic.high+1;
        else if(priority==="Medium") statistic.medium=statistic.medium+1;
        else statistic.low=statistic.low+1;
        await statistic.save();
        res.status(201).json({
            success:true,
            message:"Đã tạo mới nhiệm vụ"
        })
    } catch (error) {
        console.log(error)
    }
}
export const getAllTaskByUserController=async(req,res)=>{
    try {
       
        let {_id} = req.body;
        let {page, limit,type} = req.query;
            // Ép kiểu số nguyên
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 6;
        type=type || "ALL"
        if(!_id)
        {
             return res.status(401).json({
                 success:false,
                 message:"Không xác thực được người dùng!"

        })
        }
        const skip = (page - 1) * limit;
        console.log(type)
        if(type==="ALL") 
        {
            
            const listTask= await taskModel.find({owner:_id}).sort({createdAt:-1}) .skip(skip).limit(limit);
            
            const totalTasks = await taskModel.countDocuments({ owner: _id });
            const totalPages = Math.ceil(totalTasks / limit);
            return res.status(200).json({
                success:true,
                data:{
                    list:listTask,
                    total:totalPages
                }
            })
        }
        else 
        {
            const listTask= await taskModel.find({owner:_id,priority:type}).sort({createdAt:-1}) .skip(skip)
        .limit(limit);
        const totalTasks = await taskModel.countDocuments({ owner: _id ,priority:type});
        const totalPages = Math.ceil(totalTasks / limit);
        return res.status(200).json({
            success:true,
            data:{
                list:listTask,
                total:totalPages
            }
        })
        }
        
    } catch (error) {
        console.log(error)
    }
}
export const updateTaskController=async(req,res)=>{
    try {
        const taskId= req.params.id;
        const {title,description,priority,dueDate}= req.body || {};
        const _id = req.body._id;
        
        const task= await taskModel.findOne({_id:taskId,owner:_id});
        if(!task)
        {
            return res.status(404).json({
                success:false,
                message:"Không tìm thấy nhiệm vụ!"
            })
        }
        if(priority!==task.priority)
        {
        const statistic= await statisticsModel.findOne({owner:_id});
        if(task.priority==="High") statistic.high=statistic.high-1;
        else if(task.priority==="Medium") statistic.medium=statistic.medium-1;
        else statistic.low=statistic.low-1;
        if(priority==="High") statistic.high=statistic.high+1;
        else if(priority==="Medium") statistic.medium=statistic.medium+1;
        else statistic.low=statistic.low+1;
        await statistic.save();
        }
        
        await taskModel.findByIdAndUpdate(taskId,{title,description,priority,dueDate});
        res.status(200).json({
            success:true,
            message:"Đã cập nhật nhiệm vụ"
        })
    } catch (error) {
     console.log(error)   
    }
}
export const markTaskAsCompletedController=async(req,res)=>{
    try {
        const taskId= req.params.id;
        const _id = req.body._id;
        const task= await taskModel.findOne({_id:taskId,owner:_id});
        if(!task)
        {
            return res.status(404).json({
                success:false,
                message:"Không tìm thấy nhiệm vụ!"
            })
        }
        task.completed=true;
        task.completedAt=new Date(Date.now() + Math.floor(Math.random() * 1000));
        const statistic= await statisticsModel.findOne({owner:_id});
        statistic.pending=statistic.pending-1;
        statistic.done= statistic.done+1;
        await task.save();
        await statistic.save()
        
        res.status(200).json({
            success:true,
            message:"Đã đánh dấu nhiệm vụ đã hoàn thành"
        })
    } catch (error) {
        console.log(error)
    }
}
export const markTaskAsNotCompletedController=async(req,res)=>{
    try {
        const taskId= req.params.id;
        const _id = req.body._id;
        const task= await taskModel.findOne({_id:taskId,owner:_id});
        if(!task)
        {
            return res.status(404).json({
                success:false,
                message:"Không tìm thấy nhiệm vụ!"
            })
        }
        task.completed=false;
        task.completedAt=null;
        const statistic= await statisticsModel.findOne({owner:_id});
        statistic.pending=statistic.pending+1;
        statistic.done= statistic.done-1;
       
        await statistic.save()
        await task.save();
        res.status(200).json({
            success:true,
            message:"Đã đánh dấu nhiệm vụ chưa hoàn thành"
        })
    } catch (error) {
        console.log(error)
    }
}
export const deleteTaskController=async(req,res)=>{
    try {
        const taskId= req.params.id;
        const _id = req.body._id;
        const task= await taskModel.findOne({_id:taskId,owner:_id});    
        if(!task)
        {
            return res.status(404).json({
                success:false,
                message:"Không tìm thấy nhiệm vụ!"
            })
        }
        const statistic=await statisticsModel.findOne({owner:_id});
        statistic.total=statistic.total-1;
        const priority= task.priority;
        switch (priority) {
            case "High":
                statistic.high=statistic.high-1;
                break;
            case "Medium":
                statistic.medium=statistic.medium-1;
                break;
            case "Low":
                statistic.low=statistic.low-1;
                break;
        
            default:
                break;
        }
        const status= task.completed;
        if(status) statistic.done= statistic.done -1;
        else statistic.pending=statistic.pending-1;
        await statistic.save();
        await task.deleteOne();
        res.status(200).json({
            success:true,
            message:"Đã xóa nhiệm vụ"
        })  
    } catch (error) {
        console.log(error)
    }
}
export const getCompletedTasksController=async(req,res)=>{
    try {
        let {_id} = req.body;
        let {page, limit} = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 6;
        
        if(!_id) {
            return res.status(401).json({
                success:false,
                message:"Không xác thực được người dùng!"
            })
        }
        
        const skip = (page - 1) * limit;
        const listTask = await taskModel.find({owner:_id, completed: true}).sort({updatedAt:-1}).skip(skip).limit(limit);
        const totalTasks = await taskModel.countDocuments({ owner: _id, completed: true });
        const totalPages = Math.ceil(totalTasks / limit);
        
        return res.status(200).json({
            success:true,
            data:{
                list:listTask,
                total:totalPages
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Có lỗi xảy ra khi lấy danh sách nhiệm vụ"
        })
    }
}

export const getPendingTasksController=async(req,res)=>{
    try {
        let {_id} = req.body;
        let {page, limit} = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 6;
        
        if(!_id) {
            return res.status(401).json({
                success:false,
                message:"Không xác thực được người dùng!"
            })
        }
        
        const skip = (page - 1) * limit;
        const listTask = await taskModel.find({owner:_id, completed: false}).sort({dueDate:1}).skip(skip).limit(limit);
        const totalTasks = await taskModel.countDocuments({ owner: _id, completed: false });
        const totalPages = Math.ceil(totalTasks / limit);
        
        return res.status(200).json({
            success:true,
            data:{
                list:listTask,
                total:totalPages
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Có lỗi xảy ra khi lấy danh sách nhiệm vụ"
        })
    }
}