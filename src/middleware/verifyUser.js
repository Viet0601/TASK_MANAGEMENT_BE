import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const verifyUserMiidleWare = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Không xác thực được người dùng!",
      });
    }
    const token = authHeader.split(" ")[1];
    if (token) {
      const payload = jwt.verify(token, process.env.SECRET_KEY);
      if (payload && payload._id) {
        if (req.body) req.body._id = payload._id;
        else {
          req.body = {};
          req.body._id = payload._id;
        }
        next();
      } else {
        return res.status(401).json({
          success: false,
          message: "Không xác thực được người dùng!",
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: "Không xác thực được người dùng!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "token hết hạn hoặc không hợp lệ!",
    });
  }
};
