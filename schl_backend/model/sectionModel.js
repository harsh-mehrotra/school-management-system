import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
    sectionName: {
        type: String,
        required: true
    },
    sectionId:{
        type: String,
        required: true
    },
    students: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        },
    ],
    
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
    },
});