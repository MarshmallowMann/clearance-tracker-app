import mongoose from "mongoose";


const ApplicationSchema = new mongoose.Schema(
    {
        status: { type: String, required: true },
        step: { type: Number, required: true },
        remarks: [{
            remark: String,
            date: Date,
            commenter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            step_given: { type: Number, required: true },
        }],
        student_submission: {
            remark: String,
            link: String,
            date: Date,
            step_given: Number,
        }
        // Add field for object _id
        // application_id: 

    }
);


export default mongoose.model("Application", ApplicationSchema);
