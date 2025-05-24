import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    status: {
        type: String,
        required: true
    }
},{timestamps: true});

const Status = mongoose.model('Status', statusSchema);
export default Status;
