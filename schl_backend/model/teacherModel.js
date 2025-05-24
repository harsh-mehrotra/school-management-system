import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    className: {
        type: String,
        required: true
    },
    section:{
        type:String,
        required: true
    },
    mobileNo: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    registrationNo: {
        type: String,
        required: true
    },
    teacherId: {
        type: String,
        required: true
    },
    doj: {
        type: Date,
        default: Date.now,
        required: true
    },
    teacherPhoto: {
        url: String,
        public_id: String
    },
    address: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    // isLoggedIn: { type: Boolean, default: false },
});

const Teacher = mongoose.model('Teacher', teacherSchema);
export default Teacher;