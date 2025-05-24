import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';
import Teacher from '../model/teacherModel.js';

export const Login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(errorHandler(400, "All fields are required"));
    }

    try {
        const validUser = await Teacher.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, "User not found"));
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, "Invalid Credential"));
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: validUser._id, isAdmin: validUser.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Remove password before sending response
        const { password: pass, ...rest } = validUser._doc;

        // Set HTTP-only cookie
        const isProduction = process.env.NODE_ENV === "production";
        res.status(200).cookie("access_token", token, {
            httpOnly: true, 
            // secure: isProduction,
            secure: true,
            // sameSite: isProduction ? "None" : "Lax", 
            sameSite: "none",
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
        }).json(rest);
    } catch (error) {
        next(error);
    }
};


export const checkProtected = (req, res) => {
  // console.log(req.cookies.access_token);
  try {
    const token = req.cookies?.access_token; // Ensure cookies exist
    if (!token) {
      return res.status(401).json({ isAuthenticated: false, message: "Unauthorized - No token found" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ isAuthenticated: false, message: "Invalid or expired token" });
      }
      res.status(200).json({ isAuthenticated: true, user: decoded });
    });
  } catch (error) {
    res.status(500).json({ isAuthenticated: false, message: "Internal server error" });
  }
};
