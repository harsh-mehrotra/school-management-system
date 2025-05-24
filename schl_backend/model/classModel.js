import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    className: {
        type: String,
        required: true
    },
    section: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Section",
    },
    classId:{
        type: String,
        required: true
    },
    students: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        },
    ],
    academicYear: {
        type: String,
        required: true,
    }
});

const Class = mongoose.model('Class', classSchema);
export default Class;