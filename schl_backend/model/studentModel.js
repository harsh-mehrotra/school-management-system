import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    parentName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    rollNumber: {
        type: String,
        required: true
    },
    className: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    studentPhoto: {
        url: String,        
        public_id: String 
    },
    parentMobileNo: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    registrationNo: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    idCard: {
        url: String,        
        public_id: String 
    },
    qrCode: {
        url: String,        
        public_id: String 
    },
    studentStatus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Status'
    }
});

const Student = mongoose.model('Student', studentSchema);
export default Student;