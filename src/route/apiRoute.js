
import express from "express"
import { changePasswordController, getCurrentUserController, loginController, logoutController, refreshTokenController, registerController, updateProfileController } from "../controller/userController.js"
import { verifyUserMiidleWare } from "../middleware/verifyUser.js"
import { createTaskController, deleteTaskController, getAllTaskByUserController, markTaskAsCompletedController, markTaskAsNotCompletedController, updateTaskController, getCompletedTasksController, getPendingTasksController } from "../controller/taskController.js"
import { getAllDataTask } from "../controller/statisticController.js"

const route= express.Router()
 const initWebRoute=(app)=>{
    // user
    route.post("/register",registerController)
    route.post("/login",loginController)
    route.post("/logout",logoutController)
    route.post("/refresh-token",refreshTokenController)
    route.get("/profile",verifyUserMiidleWare,getCurrentUserController)
    route.put("/profile",verifyUserMiidleWare,updateProfileController)
    route.put("/profile/password",verifyUserMiidleWare,changePasswordController)

    // task
    route.post("/task",verifyUserMiidleWare,createTaskController);
    route.get("/task",verifyUserMiidleWare,getAllTaskByUserController);
    route.get("/task/completed",verifyUserMiidleWare,getCompletedTasksController);
    route.get("/task/pending",verifyUserMiidleWare,getPendingTasksController);
    route.put("/task/:id",verifyUserMiidleWare,updateTaskController);
    route.put("/task/:id/completed",verifyUserMiidleWare,markTaskAsCompletedController);
    route.put("/task/:id/pending",verifyUserMiidleWare,markTaskAsNotCompletedController);
    route.put("/task/:id/not-completed",verifyUserMiidleWare,markTaskAsNotCompletedController);
    route.delete("/task/:id",verifyUserMiidleWare,deleteTaskController);
    // route.get("/task/:id",verifyUserMiidleWare,getTaskByIdController); 
    // statistic

    route.get("/statistics",verifyUserMiidleWare,getAllDataTask)
    
    app.use("/api/v1.0",route);
}
export default initWebRoute;