import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';
import Teacher from '../model/teacherModel.js';

export const verifyAdmin = async(req,res,next) => {
  const token = req.cookies?.access_token;
  if(!token){
    return next(errorHandler(401, 'No token provided'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const teacher = await Teacher.findById(decoded.id);
      if (!teacher || !teacher.isAdmin) {
        return res.status(403).json({ message: "Access Denied: Admin teachers only" });
      }
      req.teacher = teacher; 
      next(); 
  } catch (error) {
    next(errorHandler(401, 'Invalid token'));
  }
}


export const verifyUser = (req, res, next) => {
  const token = req.cookies?.access_token;

  if (!token) {
    return next(errorHandler(401, "Unauthorized: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); 
  } catch (error) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};