import { errorHandler } from "../utils/error.js";
import Teacher from "../model/teacherModel.js";
import bcryptjs from 'bcryptjs';
import cloudinary from "../utils/cloudinary.js";

export const addTeacher = async (req, res, next) => {
    const { name, email, password, designation, className,section, mobileNo, gender, registrationNo, teacherId, doj, address } = req.body;

    if (!name || !email || !password || !designation || !className || !section || !mobileNo || !gender || !registrationNo || !teacherId || !doj || !address) {
        return next(errorHandler(400, 'Please fill all the fields'));
    }

    if (!req.file) {
        return next(errorHandler(400, 'Please upload photo'));
    }

    try {
        const existingTeacher = await Teacher.findOne({                                              
            $or: [{ email }, { registrationNo }, { mobileNo }, { teacherId }]
        });
        if (existingTeacher) {
            if (existingTeacher.email === email) return next(errorHandler(400, 'Email already exists'));
            if (existingTeacher.registrationNo === registrationNo) return next(errorHandler(400, 'Registration No already exists'));
            if (existingTeacher.mobileNo === mobileNo) return next(errorHandler(400, 'Mobile Number already exists'));
            if (existingTeacher.teacherId === teacherId) return next(errorHandler(400, 'Teacher Id already exists'));
            return;
        }

        let teacherPhotoData = {};
        const base64Image = `data:image/png;base64,${req.file.buffer.toString("base64")}`;
        const uploadedResponse = await cloudinary.uploader.upload(base64Image, { folder: "teachersImage" });

        teacherPhotoData = {
            url: uploadedResponse.secure_url,
            public_id: uploadedResponse.public_id
        };

        const hashedPassword = await bcryptjs.hash(password, 12);
        const newTeacher = new Teacher({
            name,
            email,
            password: hashedPassword,
            designation,
            className,
            section,
            mobileNo,
            gender,
            registrationNo,
            teacherId,
            doj,
            teacherPhoto: teacherPhotoData,
            address
        });
        const savedTeacher = await newTeacher.save();
        res.status(201).json(savedTeacher);
        console.log("Teacher added successfully");
    } catch (error) {
        next(error.message);
    }
}

export const updateTeacher = async (req, res, next) => {
    const { id } = req.params;
    const { name, email, password, designation, className, section, mobileNo, gender, registrationNo, teacherId, doj, address } = req.body;
    
    try {
        let teacher = await Teacher.findById(id);
        if (!teacher) {
            return next(errorHandler(404, "Teacher not found"));
        }        
        const existingTeacher = await Teacher.findOne({
            $or: [{ email }, { registrationNo }, { mobileNo }
                // , { teacherId }
            ],
            _id: { $ne: id }
        });

        if (existingTeacher) {
            if (existingTeacher.email === email) return next(errorHandler(400, 'Email already exists'));
            if (existingTeacher.registrationNo === registrationNo) return next(errorHandler(400, 'Registration No already exists'));
            if (existingTeacher.mobileNo === mobileNo) return next(errorHandler(400, 'Mobile Number already exists'));
            // if (existingTeacher.teacherId === teacherId) return next(errorHandler(400, 'Teacher Id already exists'));
            return;
        }

        let teacherPhotoData = {
            url: teacher.teacherPhoto?.url || "",
            public_id: teacher.teacherPhoto?.public_id || ""
        };

        if (req.file) {
            if (teacherPhotoData.public_id) {
                await cloudinary.uploader.destroy(teacherPhotoData.public_id);
            }
            const base64Image = `data:image/png;base64,${req.file.buffer.toString("base64")}`;
            const uploadedResponse = await cloudinary.uploader.upload(base64Image, { folder: "teachersImage" });
            teacherPhotoData = {
                url: uploadedResponse.secure_url,
                public_id: uploadedResponse.public_id
            };
        }

        let updatedPassword = teacher.password;
        if (password) {
            updatedPassword = await bcryptjs.hash(password, 10);
        }

        const updatedTeacher = await Teacher.findByIdAndUpdate(
            { _id: id },
            {
                name,
                email,
                password: updatedPassword,
                designation,
                className,
                section,
                mobileNo,
                gender,
                registrationNo,
                teacherId,
                doj,
                teacherPhoto: teacherPhotoData,
                address
            },
            { new: true}
          );
          await updatedTeacher.save();
        res.status(200).json(updatedTeacher);
        console.log("Teacher updated successfully");
    } catch (error) {
        next(errorHandler(500, "Internal Server Error"));
    }
}

export const getAllTeacher = async (req, res, next) => {
    try {
        const teachers = await Teacher.find();
        if (!teachers) {
            return next(errorHandler(404, 'No teacher found'));
        }
        res.status(200).json(teachers);
    } catch (error) {
        next(error.message);
    }
}

export const getTeacherById = async(req, res, next) => {
    const {id} = req.params;    
    if(!id) return next(errorHandler(404, 'Please provide id'));
    try {
        const teacher = await Teacher.findById(id);
        if(!teacher){
            return next(errorHandler(404, 'No teacher found'));
        }
        res.status(200).json(teacher);
    } catch (error) {
        next(error.message);
    }
}

export const deleteTeacher = async (req, res, next) => {
    const { id } = req.params;
    try {
        const teacherid = await Teacher.findById(id);
        if(teacherid){
            if(teacherid.teacherPhoto.public_id){
                await cloudinary.uploader.destroy(teacherid.teacherPhoto.public_id);
            }
        }
        const teacher = await Teacher.findByIdAndDelete(id);
        if (!teacher) {
            return next(errorHandler(404, 'Teacher not found'));
        }
        res.status(200).json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        next(error.message);
    }
}

export const logout = async (req, res, next) => {
    try {
        res.clearCookie("access_token", {
            httpOnly: true, 
            // secure: process.env.NODE_ENV === "production", 
            secure:true,
            // sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
            sameSite: "none",
        }).status(200).json({ message: "User has been signed out" });
    } catch (error) {
        next(error);
    }
}


export const updateTeacherImage = async (req, res, next) => {
    try {
        const { teacherId } = req.params;
        console.log(teacherId);
        
        if (!req.file) {
            return next(errorHandler(400, "No image provided"));
        }

        // Find the teacher by ID
        const teacher = await Teacher.findOne({  _id: teacherId });
        console.log(teacher);
        
        if (!teacher) {
            return next(errorHandler(404, "Teacher not found"));
        }

        // Delete old image from Cloudinary if exists
        if (teacher.teacherPhoto && teacher.teacherPhoto.public_id) {
            await cloudinary.uploader.destroy(teacher.teacherPhoto.public_id);
        }

        // Dynamically get file type
        const mimeType = req.file.mimetype; // Example: 'image/jpeg'
        const base64Image = `data:${mimeType};base64,${req.file.buffer.toString("base64")}`;
        const result = await cloudinary.uploader.upload(base64Image, {
            folder: "teachersImage"
        });
        teacher.teacherPhoto = {
            url: result.secure_url,
            public_id: result.public_id
        };
        await teacher.save();

        res.status(200).json({ message: "Image updated successfully", teacher });
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        next(error);
    }
};
