import { errorHandler } from '../utils/error.js';
import Student from '../model/studentModel.js';
import cloudinary from '../utils/cloudinary.js';
import Status from '../model/statusModel.js';
import mongoose from 'mongoose';
import QRCode from 'qrcode';
import uploadImageToCloudinary from '../services/uploadImage.js';
import Teacher from '../model/teacherModel.js';
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




// export const addStudent = async (req, res, next) => {
//     const { name, parentName, email, rollNumber, className, section, parentMobileNo, gender, registrationNo, address } = req.body;
//     if (!name || !parentName || !email || !rollNumber || !className || !section || !parentMobileNo || !gender || !registrationNo || !address) {
//         return next(errorHandler(400, 'Please fill all the fields'));
//     }

//     if (!req.file) {
//         return next(errorHandler(400, 'Please upload student photo'));
//     }

//     // try {
//     const existingRegistration = await Student.findOne({ registrationNo });
//     if (existingRegistration) {
//         return next(errorHandler(400, 'Registration No already exists'));
//     }

//     //Checking the student rollNumber already existed in class
//     const existingRollNumber = await Student.findOne({ className, rollNumber });
//     if (existingRollNumber) {
//         return next(errorHandler(400, 'Roll No already exists in this class'));
//     }

//     let studentPhotoData = {};

//     if (req.file) {
//         const base64Image = `data:image/png;base64,${req.file.buffer.toString("base64")}`;
//         const uploadedResponse = await cloudinary.uploader.upload(base64Image, { folder: "studentsImage" });
//         studentPhotoData = {
//             url: uploadedResponse.secure_url,
//             public_id: uploadedResponse.public_id
//         };
//     }

//     console.log("Before creating student");


//     const newStudent = new Student({
//         name,
//         parentName,
//         email,
//         rollNumber,
//         className,
//         section,
//         studentPhoto: studentPhotoData,
//         parentMobileNo,
//         gender,
//         registrationNo,
//         address,
//     });
//     const savedStudent = await newStudent.save();
//     console.log("After creating student");


//     let absentStatus = new Status({ studentId: savedStudent._id, status: "Absent" });
//     await absentStatus.save();

//     savedStudent.studentStatus = absentStatus._id;
//     await savedStudent.save();

//     console.log("After adding status");

//     // Creating QR Code of student MongoDB ID
//     const qrData = savedStudent._id.toString();
//     const qrCodeBuffer = await QRCode.toBuffer(qrData);
//     const qrCodeBase64 = qrCodeBuffer.toString('base64');
//     const qrCodeDataUrl = `data:image/png;base64,${qrCodeBase64}`;

//     console.log("After Creating QR Code");

//     // HTML Template of ID Card
//     const idCardHtml = `

//             <!DOCTYPE html>
//             <html lang="en">
//             <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>Student ID Card</title>
//             <style>
//                 * {
//                     margin: 0;
//                     padding: 0;
//                     box-sizing: border-box;
//                 }
//                 body {
//                     display: flex;
//                     justify-content: center;
//                     align-items: center;
//                     height: 100vh;
//                     background: url('/schoolproject/school_project/schl_webapp/public/assets/idcard_bg.png') no-repeat center center/cover rgba(35, 23, 84, 0.12) ;
//                 }
//                 .id-card {
//                     width: 260px;
//                     height: 400px;
//                     background-color:#fdf8f8;
//                     color: rgb(12, 10, 10);
//                     text-align: center;
//                     font-family: Arial, sans-serif;
//                     position: relative;
//                     overflow: hidden;
//                     padding: 15px;
//                 }
//                 .curved-top-box{
//                     max-width: 120px;
//                     position: relative;
//                     top:-15px;
//                     margin-right: auto;
//                     margin-left: auto;
//                     background: rgb(237,31,31);
//                     background: linear-gradient(0deg, rgba(237,31,31,1) 19%, rgba(135,18,18,1) 100%);
//                     border-radius: 0 0 10rem 10rem;
//                     min-height: 170px;
//                     max-height: 170px;
//                     display: flex;
//                     flex-direction: row;
//                     justify-content: center;
//                     align-items: end;
//                 }
//                 .curved-top-box::before {
//                     content: "";
//                     position: absolute;
//                     top: 12px;
//                     left: 50%;
//                     transform: translateX(-50%);
//                     width: 60px;
//                     height: 10px;
//                     background-color: white;
//                     border-radius: 10px;
//                 }
//                 .curved-bottom-box{
//                     position: relative;
//                     bottom: -15px;
//                     max-width: 120px;
//                     margin-right: auto;
//                     margin-left: auto;
//                     background: rgb(237,31,31);
//                     background: linear-gradient(180deg, rgba(237,31,31,1) 19%, rgba(135,18,18,1) 100%);
//                     border-radius: 10rem 10rem 0 0;
//                     min-height: 140px;
//                     max-height: 140px;
//                     display: flex;
//                     flex-direction: row;
//                     justify-content: center;
//                     align-items: end;
//                 }
//                 .logo {
//                     width: 40px;
//                     position: absolute;
//                     top: 20px;
//                     left: 10px;
//                 }
//                 .logo-right {
//                     right: 10px;
//                     left: auto;
//                 }
//                 .photo-container {
//                     width: 90px;
//                     height: 90px;
//                     background-color: white;
//                     border:5px solid #980A0A;
//                     border-radius: 50%;
//                     overflow: hidden;
//                     margin: 40px auto 5px;
//                     padding: 5px;
//                 }
//                 .photo-container img {
//                     width: 100%;
//                     border-radius: 50%;
//                 }
//                 .info {
//                     margin-top: 10px;
//                     font-size: 14px;
//                 }
//                 .qr-container {
//                      width: 90px;
//                     height: 90px;
//                     background-color: white;
//                     border:5px solid #980A0A;
//                     border-radius: 50%;
//                     overflow: hidden;
//                     margin: 5px auto 50px;
//                     padding: 5px;
//                 }
//                 .qr-container img {
//                     width: 100%;
//                 }
//                 .side-text {
//                     position: absolute;
//                     top: 50%;
//                     transform: translateY(-50%) rotate(-90deg);
//                     font-weight: bold;
//                     font-size: 18px;
//                 }
//                 .side-left {
//                     left: -100px;
//                 }
//                 .side-right {
//                     right: -100px;
//                 }
//             </style>
//         </head>
//         <body>
//             <div class="id-card">
//                 <div class="curved-top-box">
//                     <div class="photo-container">
//                         <img src="${studentPhotoData.url}" alt="Student Photo">
//                     </div>
//                 </div>
//                 <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjjFKiiiDc1YAYJafBG74V_lpijH2ROsMeoA&s" class="logo" alt="School Logo">
//                 <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjjFKiiiDc1YAYJafBG74V_lpijH2ROsMeoA&s" class="logo logo-right" alt="School Logo">
//                 <div class="info">
//                     <p><strong>${name}</strong></p>
//                     <p>Class: ${className} ${section}</p>
//                     <p>Roll Number: ${rollNumber}</p>
//                 </div>
//                 <div class="curved-bottom-box">
//                     <div class="qr-container">
//                     <img src="${qrCodeDataUrl}" alt="QR Code">
//                 </div>
//                 </div>
//             </div>
//         </body>
//         </html>`;

//     console.log("After creating HTML Template");

//     let idCardBuffer = await nodeHtmlToImage({
//         html: idCardHtml,
//         transparent: true,
//         // puppeteerArgs: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }

//     });




//     // const browser = await puppeteer.launch({
//     //     args: ['--no-sandbox', '--disable-setuid-sandbox'],
//     //     headless: true
//     // });
//     // const page = await browser.newPage();

//     // // Set content and take a screenshot
//     // await page.setContent(idCardHtml, { waitUntil: 'networkidle0' });
//     // const idCardBuffer = await page.screenshot({ type: 'png', fullPage: true });

//     // // Close Puppeteer
//     // await browser.close();

//     console.log("After creating ID Card Buffer");

//     const folderName = 'studentsIDCards';
//     const uploadedIdCard = await uploadImageToCloudinary(idCardBuffer, folderName);

//     console.log("After uploading ID Card");

//     savedStudent.idCard = {
//         url: uploadedIdCard.secure_url,
//         public_id: uploadedIdCard.public_id
//     };

//     console.log("After updating ID Card");

//     const updatedStudent = await savedStudent.save();
//     res.status(201).json(updatedStudent);
//     console.log("Student added successfully");

//     // } catch (error) {
//     //     console.log("Error in adding student");
//     // }
// }
export const addStudent = async (req, res, next) => {
    const { name, parentName, email, rollNumber, className, section, parentMobileNo, gender, registrationNo, address } = req.body;
    if (!name || !parentName || !email || !rollNumber || !className || !section || !parentMobileNo || !gender || !registrationNo || !address) {
        return next(errorHandler(400, 'Please fill all the fields'));
    }

    if (!req.file) {
        return next(errorHandler(400, 'Please upload student photo'));
    }

    try {
        const existingRegistration = await Student.findOne({ registrationNo });
        if (existingRegistration) {
            return next(errorHandler(400, 'Registration No already exists'));
        }

        //Checking the student rollNumber already existed in class
        const existingRollNumber = await Student.findOne({ className, rollNumber, section });
        if (existingRollNumber) {
            return next(errorHandler(400, 'Roll No already exists in this class and section'));
        }

        let studentPhotoData = {};

        if (req.file) {
            const base64Image = `data:image/png;base64,${req.file.buffer.toString("base64")}`;
            const uploadedResponse = await cloudinary.uploader.upload(base64Image, { folder: "studentsImage", quality: "auto:best" });
            studentPhotoData = {
                url: uploadedResponse.secure_url,
                public_id: uploadedResponse.public_id
            };
        }

        console.log("Before creating student");


        const newStudent = new Student({
            name,
            parentName,
            email,
            rollNumber,
            className,
            section,
            studentPhoto: studentPhotoData,
            parentMobileNo,
            gender,
            registrationNo,
            address,
        });
        const savedStudent = await newStudent.save();
        console.log("After creating student");


        let absentStatus = new Status({ studentId: savedStudent._id, status: "Absent" });
        await absentStatus.save();

        savedStudent.studentStatus = absentStatus._id;
        await savedStudent.save();

        console.log("After adding status");

        // Creating QR Code of student MongoDB ID
        const qrData = savedStudent._id.toString();
        const qrCodeBuffer = await QRCode.toBuffer(qrData);
        const qrCodeBase64 = qrCodeBuffer.toString('base64');
        const qrCodeDataUrl = `data:image/png;base64,${qrCodeBase64}`;

        console.log("After Creating QR Code");

        // HTML Template of ID Card
        const idCardHtml = `

            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Student ID Card</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background: url('/schoolproject/school_project/schl_webapp/public/assets/idcard_bg.png') no-repeat center center/cover rgba(35, 23, 84, 0.12) ;
                }
                .id-card {
                    width: 260px;
                    height: 400px;
                    background-color:#fdf8f8;
                    color: rgb(12, 10, 10);
                    text-align: center;
                    font-family: Arial, sans-serif;
                    position: relative;
                    overflow: hidden;
                    padding: 15px;
                }
                .curved-top-box{
                    max-width: 120px;
                    position: relative;
                    top:-15px;
                    margin-right: auto;
                    margin-left: auto;
                    background: rgb(237,31,31);
                    background: linear-gradient(0deg, rgba(237,31,31,1) 19%, rgba(135,18,18,1) 100%);
                    border-radius: 0 0 10rem 10rem;
                    min-height: 170px;
                    max-height: 170px;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: end;
                }
                .curved-top-box::before {
                    content: "";
                    position: absolute;
                    top: 12px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 60px;
                    height: 10px;
                    background-color: white;
                    border-radius: 10px;
                }
                .curved-bottom-box{
                    position: relative;
                    bottom: -15px;
                    max-width: 120px;
                    margin-right: auto;
                    margin-left: auto;
                    background: rgb(237,31,31);
                    background: linear-gradient(180deg, rgba(237,31,31,1) 19%, rgba(135,18,18,1) 100%);
                    border-radius: 10rem 10rem 0 0;
                    min-height: 140px;
                    max-height: 140px;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: end;
                }
                .logo {
                    width: 40px;
                    position: absolute;
                    top: 20px;
                    left: 10px;
                }
                .logo-right {
                    right: 10px;
                    left: auto;
                }
                .photo-container {
                    width: 90px;
                    height: 90px;
                    background-color: white;
                    border:5px solid #980A0A;
                    border-radius: 50%;
                    overflow: hidden;
                    margin: 40px auto 5px;
                    padding: 5px;
                }
                .photo-container img {
                    width: 100%;
                    border-radius: 50%;
                }
                .info {
                    margin-top: 10px;
                    font-size: 14px;
                }
                .qr-container {
                     width: 90px;
                    height: 90px;
                    background-color: white;
                    border:5px solid #980A0A;
                    border-radius: 50%;
                    overflow: hidden;
                    margin: 5px auto 50px;
                    padding: 5px;
                }
                .qr-container img {
                    width: 100%;
                }
                .side-text {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%) rotate(-90deg);
                    font-weight: bold;
                    font-size: 18px;
                }
                .side-left {
                    left: -100px;
                }
                .side-right {
                    right: -100px;
                }
            </style>
        </head>
        <body>
            <div class="id-card">
                <div class="curved-top-box">
                    <div class="photo-container">
                        <img src="${studentPhotoData.url}" alt="Student Photo">
                    </div>
                </div>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjjFKiiiDc1YAYJafBG74V_lpijH2ROsMeoA&s" class="logo" alt="School Logo">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjjFKiiiDc1YAYJafBG74V_lpijH2ROsMeoA&s" class="logo logo-right" alt="School Logo">
                <div class="info">
                    <p><strong>${name}</strong></p>
                    <p>Class: ${className} ${section}</p>
                    <p>Roll Number: ${rollNumber}</p>
                </div>
                <div class="curved-bottom-box">
                    <div class="qr-container">
                    <img src="${qrCodeDataUrl}" alt="QR Code">
                </div>
                </div>
            </div>
        </body>
        </html>`;

        const browser = await puppeteer.launch({
            headless: true,
            executablePath: process.env.CHROME_PATH,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--single-process', '--no-zygote', '--disable-dev-shm-usage']
        });
        const page = await browser.newPage();
        await page.setContent(idCardHtml);
        await page.setViewport({ width: 260, height: 400, deviceScaleFactor: 2 });
        console.log("Here after viewport");
        
        const imagePath = path.join(__dirname, 'example.png');
        await page.screenshot({ path: imagePath});
        console.log("Here after screenshot");

        await browser.close();

        const idCardBuffer = fs.readFileSync(imagePath);
        const folderName = 'studentsIDCards';
        const uploadedIdCard = await uploadImageToCloudinary(idCardBuffer, folderName);

        console.log("After uploading ID Card");

        fs.unlinkSync(imagePath);


        savedStudent.idCard = {
            url: uploadedIdCard.secure_url,
            public_id: uploadedIdCard.public_id
        };

        console.log("After updating ID Card");

        const updatedStudent = await savedStudent.save();
        res.status(201).json(updatedStudent);
        console.log("Student added successfully");
    } catch (error) {
        next(error.message);
    }
 
}

export const getStudentByMobileNo = async (req, res, next) => {
    const { mobileNo } = req.params;
    try {
        const student = await Student.find({ parentMobileNo: mobileNo }).populate('studentStatus');
        if (!student) {
            return next(errorHandler(404, 'Student not found'));
        }
        res.status(200).json(student);
    } catch (error) {
        console.log("Error in getting student by mobile number");
    }
}

export const getStudentById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const student = await Student.findById(id).populate('studentStatus');
        if (!student) {
            return next(errorHandler(404, 'Student not found'));
        }
        res.status(200).json(student);
    } catch (error) {
        console.log("Error in getting student by ID");
    }
}

export const getAllStudent = async (req, res, next) => {
    try {
        // sort >> .sort({ rollNumber: 1 })
        const students = await Student.find().populate('studentStatus');
        res.status(200).json(students);
    } catch (error) {
        next(error.message);
    }
}

export const pickupStudent = async (req, res) => {
    try {
        const { studentIds } = req.body;

        if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
            return next(errorHandler(400, "Invalid student IDs"));
        }

        // Convert studentIds to ObjectId
        const objectIds = studentIds.map(id => new mongoose.Types.ObjectId(id));

        // Find existing statuses for the given student IDs
        const existingStatuses = await Status.find({ studentId: { $in: objectIds } });

        // Get student IDs that already have a status
        const existingStudentIds = existingStatuses.map(status => status.studentId.toString());

        // Identify students who need a new status entry
        const newStudentIds = studentIds.filter(id => !existingStudentIds.includes(id));

        // 1. Insert new status records for students without existing entries
        let newStatuses = [];
        if (newStudentIds.length > 0) {
            newStatuses = await Status.insertMany(
                newStudentIds.map(studentId => ({
                    studentId: new mongoose.Types.ObjectId(studentId),
                    status: "Parent Arrived"
                }))
            );

            // **Update the Student model to reference the newly created Status**
            await Promise.all(
                newStatuses.map(status =>
                    Student.findByIdAndUpdate(status.studentId, { studentStatus: status._id })
                )
            );
        }

        // 2. Update status for students who already have an entry
        await Status.updateMany(
            { studentId: { $in: existingStudentIds } },
            { $set: { status: "Parent Arrived" } }
        );

        // 3. Fetch all updated student statuses with student details
        const updatedStatuses = await Status.find({ studentId: { $in: objectIds } })
            .populate("studentId", "name parentName rollNumber className section studentPhoto parentMobileNo gender registrationNo address idCard qrCode"); // Populating student details

        res.status(200).json({
            message: "Student statuses updated successfully",
            students: updatedStatuses
        });
    } catch (error) {
        console.error("Error updating student statuses", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//Done
export const releaseBySchool = async (req, res, next) => {
    try {
        const { studentId } = req.params;

        if (!studentId) {
            return next(errorHandler(400, 'Invalid student ID'));
        }

        // Update the status for the single student
        const updateResult = await Status.updateOne(
            { studentId: studentId, status: "Parent Arrived" }, // Match only if status is "Parent Arrived"
            { $set: { status: "Released" } }, // Update status
            { new: true }
        );
        if (updateResult.matchedCount === 0) {
            return next(errorHandler(404, "Student not found"));
        }
        res.status(200).json({ message: "Student status updated successfully", updateResult, updatedStatus: "Released" });
    } catch (error) {
        console.error("Error updating student status", error);
        next(error.message);
    }
};


//Done
export const confirmByParent = async (req, res, next) => {
    try {
        const { studentIds } = req.body;
        if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
            return next(errorHandler(400, "Invalid student IDs"));
        }

        // Update the status for all matching students
        const updateResult = await Status.updateMany(
            { studentId: { $in: studentIds }, status: "Released" }, // Match only if status is "Released"
            { $set: { status: "Parent pickedup" } }
        );

        if (updateResult.matchedCount === 0) {
            return res.status(404).json({ message: "No students found with given IDs" });
        }

        res.status(200).json({ message: "Student statuses updated successfully", updateResult });
    } catch (error) {
        console.error("Error updating student statuses", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get unique class names dynamically
export const getClasses = async (req, res, next) => {
    try {
        const classes = await Student.distinct("className");
        const sortedClasses = classes
            .map(cls => Number(cls))
            .sort((a, b) => a - b)
            .map(cls => cls.toString());

        res.json(sortedClasses);
    } catch (error) {
        next(errorHandler(500, "Server Error"));
    }
}


export const inClass = async (req, res, next) => {
    try {
        const { studentIds } = req.body;
        if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
            return next(errorHandler(400, "Invalid student IDs"));
        }

        // Update the status for all matching students
        const updateResult = await Status.updateMany(
            { studentId: { $in: studentIds } }, // Find all students in the given array
            { $set: { status: "In Class" } } // Update their status
        );

        if (updateResult.matchedCount === 0) {
            return res.status(404).json({ message: "No students found with given IDs" });
        }

        res.status(200).json({ message: "Student statuses updated successfully", updateResult });
    } catch (error) {
        console.error("Error updating student statuses", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getALL = async (req, res, next) => {
    const { userType } = req.query;
    const { className } = req.query;
    try {
        let filter = {};
        if (userType == 'teacher') {
            if (className == 'all') {
                const teachers = await Teacher.find();
                return res.json(teachers);
            }
            else if (className) {
                filter.className = className;
                const teachers = await Teacher.find(filter);
                return res.json(teachers);
            }
            else {
                const teachers = await Teacher.find();
                return res.json(teachers)
            }
        } else if (userType == 'student') {
            if (className == 'all') {
                const students = await Student.find().populate('studentStatus');
                return res.json(students)
            }
            else if (className) {
                filter.className = className;
                const students = await Student.find(filter).populate("studentStatus");
                return res.json(students);
            }
            else {
                const students = await Student.find();
                return res.json(students);
            }
        }
    } catch (error) {
        next(error.message)
    }
}


//Updation required
export const statusPresent = async (req, res, next) => {
    try {
        const { studentId } = req.params;
        console.log(studentId);

        if (!studentId) {
            return next(errorHandler(400, 'Invalid student ID'));
        }

        // Update the status only if the current status is "Absent"
        const updateResult = await Status.updateOne(
            { studentId: studentId, status: "Absent" }, // Match only if status is "Absent"
            { $set: { status: "In Class" } } // Update status
        );

        console.log(updateResult);
        if (updateResult.matchedCount === 0) {
            return next(errorHandler(404, "Student not found or status is not 'Absent'"));
        }

        res.status(200).json({ message: "Student status updated successfully", updateResult, updatedStatus: "In Class" });
    } catch (error) {
        console.error("Error updating student status", error);
        next(error.message);
    }
}

export const exportIdCards = async (req, res, next) => {
    const { className } = req.query;

    let filter = {};
    if (className == 'all') {
        const studentsId = await Student.find().select("idCard.url");
        const idCardLinks = studentsId.map((student) => student.idCard.url);
        return res.json(idCardLinks)
    } else if (className) {
        filter.className = className
        const studentsId = await Student.find(filter).select("idCard.url");
        const idCardLinks = studentsId.map((student) => student.idCard.url);
        return res.json(idCardLinks)
    }

}


export const deleteStatus = async (req, res, next) => {
    const { id } = req.params;
    try {
        const del = await Status.findByIdAndDelete(id);
        res.json(del);
    } catch (error) {
        console.log("Nhi hoga delete");
    }
}

// export const updateStudent = async (req, res, next) => {
//     const { id } = req.params;
//     const { name, email, rollNumber, className, section, parentMobileNo, gender, registrationNo, address } = req.body;

//     if (!name || !email || !rollNumber || !className || !section || !parentMobileNo || !gender || !registrationNo || !address) {
//         return next(errorHandler(400, 'Please fill all the fields'));
//     }

//     try {
//         const student = await Student.findById(id);
//         // const existingStudent = await Student.findOne({
//         //     $or: [{ email }, { registrationNo }, { rollNumber }]
//         // });
//         // if(existingStudent){
//         //     if(existingStudent.email === email) return next(errorHandler(400, 'Email already exists'));
//         //     if(existingStudent.registrationNo === registrationNo) return next(errorHandler(400, 'Registration No already exists'));
//         //     if(existingStudent.rollNumber === rollNumber) return next(errorHandler(400, 'Roll No already exists'));
//         //     return;
//         // }
//         if (!student) {
//             return next(errorHandler(404, 'Student not found'));
//         }

//         student.name = name;
//         student.email = email;
//         student.rollNumber = rollNumber;
//         student.className = className;
//         student.section = section;
//         student.parentMobileNo = parentMobileNo;
//         student.gender = gender;
//         student.registrationNo = registrationNo;
//         student.address = address;

//         const updatedStudent = await student.save();
//         res.status(200).json(updatedStudent);
//     } catch (error) {
//         console.log(error.message);
//         return next(errorHandler(500, 'Something went wrong'));
//     }
// };


// Currently unused
export const deleteStudent = async (req, res, next) => {
    const { id } = req.params;
    try {
        const student = await Student.findById(id);
        if (!student) {
            return next(errorHandler(404, 'Student not found'));
        }
        if (student.studentPhoto.public_id) {
            await cloudinary.uploader.destroy(student.studentPhoto.public_id);
        }
        if(student.idCard.public_id){
            await cloudinary.uploader.destroy(student.idCard.public_id);
        }
        const deletedStudent = await Student.findByIdAndDelete(id);
        res.status(200).json(deletedStudent);
    } catch (error) {
        next(error.message);
    }
}