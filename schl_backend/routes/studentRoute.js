import { Router } from 'express';
import { addStudent, getStudentByMobileNo, getAllStudent, pickupStudent, releaseBySchool, confirmByParent, getStudentById, inClass, getClasses, getALL, exportIdCards, deleteStatus, statusPresent } from '../controller/studentController.js';
import { verifyAdmin, verifyUser } from '../utils/verifyUser.js'
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });

// import upload from '../utils/multerConfig.js';

const router = Router();

router.post('/addStudent', verifyUser, upload.single("studentPhoto"), addStudent);
router.get('/getStudentDataByMobileNo/:mobileNo', getStudentByMobileNo);
router.get('/getAllStudent', getAllStudent);  //unused
router.get('/getStudentById/:id', getStudentById);
// router.put('/updateStudent', updateStudent);


//=============================== All routes for Status update ===========================
router.patch('/status/markInClass/:studentId', verifyUser, statusPresent );
router.patch('/status/pickupStudent', pickupStudent);
router.patch('/status/release/:studentId', releaseBySchool);
router.patch('/status/confirm', confirmByParent);
router.patch('/status/inClass', inClass)
//=========================================================================================

router.get('/getClasses', getClasses);

router.get('/getAll',verifyUser, getALL);

router.get('/exportIdCards', exportIdCards);

router.delete('/deleteStatus/:id',deleteStatus); //unused

export default router;
