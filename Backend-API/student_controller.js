import mongoose from "mongoose";

import User from "./models/user.js";
import Application from "./models/application.js";

import PDFDocument from "pdfkit";

// Open Clearance Application

const openApplication = async (req, res) => {
    // Student Generates a new Clearance Application
    // Sample Request Body:
    // {
    // student_id:
    // remark:
    // link:
    //}

    // Output:
    // {
    // status: "Pending",
    // step: 1,
    // remarks: [],
    // student_submission: {
    //     remark: data.remark || "",
    //     link: data.link || "" ,
    //     date: Date.now(),
    //     step_given: 1,
    // },
    // }
    const data = req.body;
    console.log(data);
    const newApplication = new Application({
        status: "Pending",
        step: 1,
        remarks: [],
        student_submission: {
            remark: data.remark || "",
            link: data.link || "" ,
            date: Date.now(),
            step_given: 1,
        },
    });

    const result = await newApplication.save()
    if (result._id) {
        // Add application to user's applications
        console.log(data.user_id);
        // const user = await User.findById(data.user_id);
        await User.updateOne({_id: data.user_id}, {$push: {applications: result._id}});
        res.send(result);
    } else {
        res.send({ success: false, message: "Failed to create new application." });
    }
    
    return;

}

// Close Clearance Application
const closeApplication = async (req, res) => {
    // Student closes an existing application
    // Student can only close an application if it is not yet approved

    /* 
    Request Body:
    {
        application_id:
    }

    Output:
    application with status: "Closed"
    */

    const data = req.body;
    const application = await Application.findById(data.application_id);

    if (application.status == "Approved") {
        res.send({success: false, message: "Cannot close an approved application."});
        return;
    } else if (application.status == "Closed") {
        res.send({success: false, message: "Application is already closed."});
        return;
    } else {
        application.status = "Closed";
        const result = await application.save();
        if (result._id) {
            res.send(result);
        } else {
            res.send({ success: false, message: "Failed to close application." });
        }
    }

}


//  print a PDF from a cleared application
const printApplication = async (req, res) => {
    // Print a PDF from a cleared application
    // Sample Request Body:
    // {
    // application_id:
    // }

    // Output:
    // PDF file
    const data = req.body;
    const application = await Application.findById(data.application_id)
    // Find who submitted the application
    if (!application) {
        res.send({success: false, message: "Application not found."});
        return;
    }

    let student = await User.find({applications: data.application_id})
    console.log(student)
    if (!student) {
        res.send({success: false, message: "Student not found."});
        return;
    }

    let adviser;
    try {
        adviser = await User.findOne({_id: student[0].adviser});

    } catch (err) {
        adviser = null;
    }
    if (!adviser) {
        adviser = {
            first_name: "ICS",
            middle_name: "Registration",
            last_name: "Committee",
        }
    }
    let clearanceOfficer = await User.findOne({user_type: "Clearance Officer"});
    if (!clearanceOfficer) {
        clearanceOfficer = {
            first_name: "ICS",
            middle_name: "Registration",
            last_name: "Committee",
        }
    }
    if (application.status === "Cleared") {
        // Generate PDF
        const doc = new PDFDocument({font: 'Times-Roman', size: "LETTER"});
        // Header
        doc.fontSize(25).text("University of the Philippines Los Baños", {align: 'center'});
        doc.fontSize(20).text("College of Arts and Sciences", {align: 'center'});

        doc.fontSize(20).text("Institute of Computer Science", {align: 'center'});
        // Horizontal Line after text
        doc.moveTo(72, 150).lineTo(540, 150).stroke();

        doc.moveDown();
        doc.moveDown();
        // Date
        const date = new Date(Date.now());
        const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        doc.fontSize(15).text(`Date: ${dateString} `, {align: 'left'});
        // New line
        doc.moveDown();
        doc.moveDown();

        const name = `${student[0].first_name} ${student[0].middle_name} ${student[0].last_name}`;
        const text = `This document certifies that ${name}, ${student[0].student_number} has satisfied the clearance requirements of the institute.`;

        doc.fontSize(15).text(text, {align: 'justify'});
        doc.moveDown();
        doc.moveDown();
        doc.fontSize(15).text("Verified:", {align: 'left'});
        doc.moveDown();
        const adviserName = `${adviser.first_name} ${adviser.middle_name} ${adviser.last_name}`;
        doc.fontSize(15).text(`Academic Adviser : ${adviserName}`, {align: 'left'});
        const clearanceOfficerName = `${clearanceOfficer.first_name} ${clearanceOfficer.middle_name} ${clearanceOfficer.last_name}`;
        doc.fontSize(15).text(`Clearance Officer  : ${clearanceOfficerName}`, {align: 'left'});
        doc.moveDown();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline; filename=clearance.pdf");
        doc.pipe(res);
        doc.end()
    } else {
        res.send({success: false, message: "Cannot print an unapproved application."});
    }

    
}


// view current status of clearance application
const viewSingleApplication = async (req, res)  => {
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
    const application = await Application.findById(data.application_id)
    .populate('remarks.commenter');
    const student = await User.find({applications: data.application_id});
    
    let adviser;
    //check if adviser is assigned
    try {
      adviser = await User.findById(student[0].adviser);
    } catch (err) {
      adviser = null;
    }

    if (application) {
        res.send({application, student, adviser});
    } else {
        res.send({success: false, message: "Application not found."});
    }
}


// Submit requirements to acad adviser
const submitAdviser = async (req, res) => {
    /*
    Sample Request Body:
    {
        application_id:
    }
    */
    // Change step to step 2
    const data = req.body;
    const application = await Application.findById(data.application_id);
    if (application) {
        application.step = 2;
        application.student_submission.step_given = 2;
        application.student_submission.link = data.link;
        const result = await application.save();
        if (result._id) {
            res.send(result);
        } else {
            res.send({ success: false, message: "Failed to submit to adviser." });
        }
    } else {
        res.send({success: false, message: "Application not found."});
    }

}

// Submit requirements to clearance officer
const submitOfficer = async (req, res) => {
    // Change step to step 4
        /*
    Sample Request Body:
    {
        application_id:
    }
    */
    const data = req.body;
    const application = await Application.findById(data.application_id);
    if (application) {
        application.step = 4;
        application.student_submission.step_given = 4;

        const result = await application.save();
        if (result._id) {
            res.send(result);
        } else {
            res.send({ success: false, message: "Failed to submit to officer." });
        }
    } else {
        res.send({success: false, message: "Application not found."});
    }

}

// Resubmit returned application at current step.
const resubmitAtCurrStep = async (req, res) => {
    // Change step to data.step
    // Add remark to remarks

    /*
    Sample Request Body:
    {
        application_id:
        step:
        remark:
        commenter:
    }
    */
    const data = req.body;
    const application = await Application.findById(data.application_id);
    if (application) {
        application.step = data.step;
        application.student_submission.step_given = data.step;
        application.remarks.push({
            remark: data.remark || "",
            date: Date.now(),
            commenter: data.commenter || "",
            step_given: data.step,
        });
        const result = await application.save();
        if (result._id) {
            res.send(result);
        } else {
            res.send({ success: false, message: "Failed to resubmit application." });
        }
    }

}



const viewAllApplications = async (req, res) => {
    // View all applications of a student
    // Sample Request Body:
    // {
    // user_id:
    // }
    const data = req.body;
    const applicationsJson = []
    let applications = await User.findById(data.user_id)
    applications = applications.applications;
    if (!applications) {
        res.send({success: false, message: "No applications found."});
        return
    }
    console.log(applications.length)
    // For each applicaiton in applications, get the application and push it to applicationsJson
    for (let i = 0; i < applications.length ; i++) {
        console.log(applications[i]._id.toString())
        const application = await Application.findById(applications[i]._id);
        applicationsJson.push(application);
    }

    res.send(applicationsJson);

}

const clearApplication = async (req, res) => {
    // Change status to Approved
    // Sample Request Body:
    // {
    // application_id:
    // }
    const data = req.body;
    const application = await Application.findById(data.application_id);
    if (application) {
        application.status = "Cleared";
        application.step = 5;
        const result = await application.save();
        if (result._id) {
            res.send(result);
        } else {
            res.send({ success: false, message: "Failed to clear application." });
        }
    }

}


export { openApplication, closeApplication, printApplication, viewSingleApplication, submitAdviser, submitOfficer, resubmitAtCurrStep, viewAllApplications, clearApplication }; // export the function

