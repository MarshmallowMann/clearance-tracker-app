import mongoose from "mongoose";
import User from "./models/user.js";
import Application from "./models/application.js";

// List of Pending Applications filtered to a specific approver
// input: {approver_id: String}
// output: [Application]
const viewPendingApplications = async (req, res) => {
    const data = req.body;
    
    const advisees = await User.find({ adviser: new mongoose.Types.ObjectId(data.approver_id) }).populate('applications');

    console.log(advisees)
    res.send(advisees);

}

const viewAdvisees = async (req, res) => {
    const data = req.body;
    if (data.approver_id) {
    const advisees = await User.find({ adviser: new mongoose.Types.ObjectId(data.approver_id) });
        if (advisees) {
            res.send(advisees);
        } else {
            res.send([]);
        }
    } else {
        res.send([]);
    }
}


// View specific application
const viewSingleApplicationApprover = async (req, res) => {
    // view status of application + other info
    /*
    Sample Request Body:
    {
        application_id:
    }

    Output:
    Student Submission
    */
    let data = req.body;
    const application = await Application.findById(data.application_id);
    if (application) {
        res.send(application);
    } else {
        res.send({ success: false, message: "Application not found." });
    }
}


// Approve application
const approveApplication = async (req, res) => {
    let data = req.body;
    const application = await Application.updateOne({ _id: data.application_id },
        {
            $set: { step: 3 },
        });

    if (application.modifiedCount === 1) {
        res.send({ success: true });
    } else {
        res.send({ success: false });
    }

}


// Return application with remarks
const disapproveApplication = async (req, res) => {
    let data = req.body;
    const application = await Application.updateOne({ _id: data.application_id }, {
        $push: { remark: data.remark, date: data.date, commenter: data.approver_id, step_given: 1 } // ano ilalagay sa step given
    });

    if (application.modifiedCount === 1) {
        res.send({ success: true });
    } else {
        res.send({ success: false });
    }
}

export { viewAdvisees,viewPendingApplications, viewSingleApplicationApprover, approveApplication, disapproveApplication }

