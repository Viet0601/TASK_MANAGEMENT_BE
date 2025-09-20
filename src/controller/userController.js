import validator from "validator";
import userModel from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import statisticsModel from "../model/statisticsModel.js";
dotenv.config();
const generateAccessToken = (data) => {
  return jwt.sign(data, process.env.SECRET_KEY, { expiresIn: "7d" });
};
const generateRefreshToken = (data) => {
  return jwt.sign(data, process.env.SECRET_KEY, { expiresIn: "30d" });
};
const isValidToken = (token) => {
  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    return true;
  } catch (error) {
    return false;
  }
};

export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin người dùng!",
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Email không hợp lệ!",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu tối thiểu 6 kí tự!",
      });
    }
    const isExist = await userModel.findOne({ email });
    if (isExist) {
      return res.status(400).json({
        success: false,
        message: "Email đã được đăng kí!",
      });
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const user = await userModel.create({
      email,
      password: hashPassword,
      name,
    });
    await statisticsModel.create({owner:user._id})
    return res.status(201).json({
      success: true,
      message: "Đăng kí tài khoản thành công",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi từ hệ thống!",
    });
  }
};
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin người dùng!",
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Email không hợp lệ!",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email hoặc mật khẩu không hợp lệ!",
      });
    
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res.status(400).json({
        success: false,
        message: "Email hoặc mật khẩu không hợp lệ!",
      });
    }
    const access_token = generateAccessToken({ _id: user?._id, email: email });
    const refresh_token = generateRefreshToken({ _id: user?._id, email: email });
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true, // Không thể đọc bằng JS
      secure: true, // Chỉ gửi trên HTTPS
      sameSite: "None", // Nếu dùng cross-site
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      path: "/",
    });
    res.status(200).json({
      success: true,
      data: access_token
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi từ hệ thống!",
    });
  }
};
export const refreshTokenController = async (req, res) => {
  try {
    // console.log(req)
    const refresh_token = req.cookies.refresh_token;
    // const refreshToken = req.cookies.refresh_token;
    if (!refresh_token) {
         return res.status(401).json({
            success:false,

        })
    }
    if (isValidToken(refresh_token)) {
      const payload = jwt.verify(refresh_token, process.env.SECRET_KEY);
      const access_token = generateAccessToken({_id:payload._id,email:payload.email});
      res.cookie("refresh_token", refresh_token, {
        httpOnly: true, // Không thể đọc bằng JS
        secure: true, // Chỉ gửi trên HTTPS
        sameSite: "None", // Nếu dùng cross-site
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        path: "/",
      });
      return res.status(200).json({
        success:true,
        data:access_token
      })
    }
    else 
    {
        return res.status(401).json({
            success:false,

        })
    }
  } catch (error) {
    console.log(error)
    return res.status(401).json({
            success:false,

        }) 
  }
};
export const getCurrentUserController=async(req,res)=>{
    try {
        const _id= req.body._id || '';
        if(!_id)
            
        {
            return res.status(401).json({
            success:false,

        })
        }
        const user=await userModel.findById(_id).select("-password -otp -expiredOtp");
        if(!user)
        {
            return res.status(404).json({
            success:false,
            message:"Không tìm thấy người dùng!"

        })

        }
         return res.status(200).json({
            success:true,
            data:user

        })
    } catch (error) {
       console.log(error) 
    }
}
export const updateProfileController=async(req,res)=>{
  try {
    const {bio,name}= req.body || {};
    const _id = req.body._id;
    if(!_id)
    {
       res.status(401).json({
        success:false,
       message:"Người dùng chưa được xác thực!"
      })
    }
    if(!bio || !name)
    {
      res.status(400).json({
        success:false,
        message:"Thiếu thông tin người dùng!"
      })
    }
    const update= await userModel.findByIdAndUpdate(_id,{name,bio},{new:true}).select("-password -otp -expiredOtp")
    res.status(200).json({
      success:true,
      message:"Cập nhật thành công",
      data:update
    })

  } catch (error) {
    console.log(error)
  }
}
export const changePasswordController=async(req,res)=>{
  try {
    console.log(new Date().getTime())
    const _id= req.body._id;
    const {currentPassword,newPassword,confirmPassword}=req.body || {}
    if(!currentPassword || !newPassword || !confirmPassword)
    {
      return res.status(400).json({
        success:false,
       message:"Các trường không được để trống!"
      })
    }
    if(!_id)
    {
      return res.status(401).json({
        success:false,
       message:"Người dùng chưa được xác thực!"
      })
    }
    const user= await userModel.findById(_id);
    if(!user)
    {
      return res.status(404).json({
        success:false,
       message:"Không tìm thấy người dùng!"
      })
    }
    if(newPassword !== confirmPassword){
      return res.status(400).json({
        success:false,
       message:"Mật khẩu không trùng khớp!"
      })
    }
    if(newPassword.length<6)
    {
      return res.status(400).json({
        success:false,
       message:"Mật khẩu tối thiểu 6 kí tự!"
      })
    }
    
    const checkPassword= await bcrypt.compare(currentPassword,user.password);
    console.log(checkPassword)
    if(!checkPassword)
    {
      return res.status(400).json({
        success:false,
       message:"Mật khẩu không chính xác!"
      })
    }
    const hashed= await bcrypt.hash(newPassword,12);
    await userModel.findByIdAndUpdate(_id,{password:hashed});
    return res.status(200).json({
        success:true,
       message:"Đổi mật khẩu thành công"
      })

  } catch (error) {
    console.log(error)
  }
}
export const logoutController=async(req,res)=>{
  try {
    res.cookie("refresh_token", '', {
      httpOnly: true,
      secure:true, // Không thể đọc bằng JS
      sameSite: "None", // Nếu dùng cross-site
      maxAge: 0, // 7 ngày
      path: "/",
    });
    res.status(200).json({
      success:true
    })
  } catch (error) {
    console.log(error);
  }
}