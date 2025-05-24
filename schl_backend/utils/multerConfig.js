import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  limits: { fileSize: 10 * 1024 * 1024 },
  params: {
    folder: "studentsImage",
    allowed_formats: ["jpg", "png", "jpeg"],
    resource_type: "image",
    secure: true,  
  },
});

const upload = multer({ storage });

export default upload;
