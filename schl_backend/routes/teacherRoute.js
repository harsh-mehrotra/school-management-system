import { Router } from "express";
import { addTeacher, updateTeacher, getAllTeacher, deleteTeacher, logout, getTeacherById, updateTeacherImage } from "../controller/teacherController.js";
import {verifyAdmin, verifyUser} from "../utils/verifyUser.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });
// import upload from "../utils/multerConfig.js";

const router = Router();

// All routes permission only for admin

router.post("/addTeacher", verifyUser, upload.single("teacherPhoto"), addTeacher);
router.put("/updateTeacher/:id",verifyUser, upload.single("teacherPhoto"),updateTeacher);
router.get("/getAllTeacher",verifyUser, getAllTeacher); //unused
router.get("/getTeacherById/:id",verifyUser, getTeacherById)
router.delete("/deleteTeacher/:id", verifyUser, deleteTeacher); //currently unused
router.post("/logout", logout);
router.put('/updateTeacherImage/:teacherId',verifyUser, upload.single("teacherPhoto"), updateTeacherImage);



export default router;
