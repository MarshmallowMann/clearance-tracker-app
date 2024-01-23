import mongoose from "mongoose";
import bcrypt, { hash } from "bcrypt";

import Application from "./models/application.js";
import User from "./models/user.js";

const getAdviser = async (req, res) => {
  let data = req.query;
  const adviser = await User.findById(data.adviser_id);
  res.send(adviser);
};

// const getAdviser = async (req, res) => {
//   const ObjectID = require('mongodb').ObjectID; 
//   let data = req.query;
//   const adviser = await User.find({"_id":new ObjectID(data.adviser_id)});
//   console.log(adviser)
//   res.send(adviser);
// };

// List pending student account application requests
// input: N/A
// output: array of accounts that are pending
const viewPendingAccounts = async (req, res) => {
  const pendingAccs = await User.find({
    user_type: "student",
    user_status: "pending",
  });
  res.send(pendingAccs);
};

// List pending student account application requests
// input: N/A
// output: array of accounts that are pending
const viewApprovedAccounts = async (req, res) => {
  const approvedAccs = await User.find({
    user_type: "student",
    user_status: "approved",
  });
  res.send(approvedAccs);
};

// Approve or Reject student account
// input: {"student_number" : String, "user_status": String}
// output: {'success' : Boolean}
const handleAccount = async (req, res) => {
  const account = await User.findOne(
    { student_number: req.body.student_number },
    { $set: { user_status: req.body.status } }
  );

  if (account.modifiedCount == 1) {
    res.send({ success: true });
  } else {
    res.send({ success: false });
  }
};

// Assign adviser to a student account
// input: {"employee_number" : String, "student_number" : String}
// output: {'success': Boolean}
const assignAdviser = async (req, res) => {
  const adviserId = await User.findOne({
    employee_number: req.body.employee_number,
  });

  const updateAdviser = await User.updateOne(
    { student_number: req.body.student_number },
    { $set: { adviser: new mongoose.Types.ObjectId(adviserId._id) } }
  );


  if (updateAdviser.modifiedCount == 1) {
    res.send({ success: true });
  } else {
    res.send({ success: false });
  }
};

// Create Approver Acct.
// input: {"first_name" : String, "middle_name" : String,"last_name" : String,"employee_number" : String,"email" : String,"password" : String,"user_type" : String, "user_status" : String}
// output: {'success': Boolean}
const createApprover = async (req, res) => {
  const {
    first_name,
    middle_name,
    last_name,
    employee_number,
    email,
    password,
    user_type,
    user_status,
  } = req.body;

  const newApprover = new User({
    first_name,
    middle_name,
    last_name,
    employee_number,
    email,
    password,
    user_type,
    user_status,
  });

  const result = await newApprover.save();

  if (result._id) {
    res.send(result);
  } else {
    res.send({ success: false });
  }
};

// Edit Approver Acct.
// input: {"employee_number" : String, "newPassword" : String}
// output: {'success': Boolean}
const editApprover = async (req, res) => {
  let password = req.body.newPassword;

  bcrypt.genSalt((saltError, salt) => {
    if (saltError) {
      return next(saltError);
    }
    bcrypt.hash(password, salt, async (hashError, hash) => {
      if (hashError) {
        return res.send({ success: false, message: hashError });
      }
      password = hash;

      const editedApprover = await User.updateOne(
        { employee_number: req.body.employee_number },
        { password: password }
      );

      if (editedApprover.modifiedCount == 1) {
        res.send({ success: true });
      } else {
        res.send({ success: false });
      }
    });
  });
};

// Delete Approver Acct.
// input: {"employee_number" : String}
// output: {'success' : Boolean}
const deleteApprover = async (req, res) => {
  const { employee_number } = req.body;

  // get _id of approver
  const toDelete = await User.find({ employee_number });
  const _id = toDelete[0]._id;
  
  // Find all students with the deleted approver
  const students = await User.find({ adviser: new mongoose.Types.ObjectId(_id) });
  // Remove adviser from students
  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    await User.updateOne(
      { student_number: student.student_number },
      { adviser: null }
    );
  }


  const result = await User.deleteOne({ employee_number });

  if (result.deletedCount == 1) {
    res.send({ success: true });
  } else {
    res.send({ success: false });
  }
};

// search approver by name
// input: first_name=<first name>
// output: Array of approvers with the specified first name
// const getApproverByName = async (req, res) => {
//   const approver = await User.find({
//     first_name: req.query.first_name,
//     user_type: "approver",
//   });
//   res.send(approver);
// };

// List All Approver Acct.
// input: N/A
// output: array of approvers
const listApprover = async (req, res) => {
  const approverAccs = await User.find({ user_type: "approver" });
  res.send(approverAccs);
};

// list all applications
const listApplications = async (req, res) => {
  const students = await User.find({ user_type: "student" });

  // list down all applications of advisees that are pending
  const studentApplications = [];
  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    let adviser;
    //check if adviser is assigned
    try {
      adviser = await User.findById(student.adviser);
    } catch (err) {
      adviser = null;
    }
    const applications = student.applications;
    let applicationContent = [];
    for (let j = 0; j < applications.length; j++) {
      const application = applications[j];
      // Get Reference APplication Data
      const applicationData = await Application.findById(application._id);
      if (applicationData.status == "Pending") {

        applicationContent.push(applicationData);
      }
    }
    if (applicationContent.length > 0) {
      studentApplications.push({ student, applicationContent, adviser: adviser });
    }

  }


  res.send(studentApplications);
};
// List All User, either student or adviser
// const listUser = async (req, res) => {
//     const userAccs = await User.find({ user_type: req.body.type });
//     res.send(userAccs);
//   };

// Approve student
// input: {"student_number" : String}
// description: changes user_status to approved
// output: {'success' : Boolean}
const approveStudent = async (req, res) => {
  const { student_number } = req.body;
  const result = await User.updateOne(
    { student_number },
    { user_status: "approved" }
  );
  if (result.modifiedCount == 1) {
    res.send({ success: true });
  } else {
    res.send({ success: false });
  }
};

// Approve student
// input: {"student_number" : String}
// description: changes user_status to rejected
// output: {'success' : Boolean}
const rejectStudent = async (req, res) => {
  const { student_number } = req.body;
  const result = await User.updateOne(
    { student_number },
    { user_status: "rejected" }
  );
  if (result.modifiedCount == 1) {
    res.send({ success: true });
  } else {
    res.send({ success: false });
  }
};

const pendingApplicationStudent = async (req, res) => {
  const { student_number } = req.body;
  const applicationsStudent = await User.findOne({ student_number })
    .applications;
  const pendingApplication = {};
  for (let i = 0; i < applicationsStudent.length; i++) {
    const appli = applicationsStudent[i];

    const pending = await Application.findById(appli._id);
    if (pending.status == "pending") {
      pendingApplication = pending;
    }
  }
  res.send(pendingApplication);
};


const getCounts = async (req, res) => {
  const pendingStudents = await User.find({ user_type: "student", user_status: "pending" });  
  const advisers = await User.find({ user_type: "approver" });
  const students = await User.find({ user_type: "student", user_status: "approved" });
  const applications = await Application.find({ status: "Pending" });
  const counts = {
    pendingStudents: pendingStudents.length ,
    advisers: advisers.length ,
    students: students.length ,
    applications: applications.length,
  }
  res.send(counts);

}


const uploadCsv = async (req, res) => {
  const { data } = req.body;
  for (let i = 0; i < data.length; i++) {
    let user = await User.findOne({ student_number: data[i][0] });
    console.log(user)
    if (user) {
      // Find Adviser
      let lastName = data[i][1].substring(2).toLowerCase()
      let firstName = `^${data[i][1][0].toLowerCase()}`
      let middleName = `^${data[i][1][1].toLowerCase()}`
      let adviser = await User.findOne({first_name: {$regex: firstName, $options: 'i'}, middle_name: { $regex: middleName, $options: 'i' }  ,last_name: {$regex: lastName,$options: 'i'} });
      if (adviser) {
        let res = await user.updateOne({ adviser: new mongoose.Types.ObjectId(adviser._id) });
        console.log(res);
      }
    }

  }

  res.send({ success: true });
}

export {
  viewPendingAccounts,
  handleAccount,
  assignAdviser,
  deleteApprover,
  // getApproverByName,
  listApprover,
  createApprover,
  editApprover,
  listApplications,
  rejectStudent,
  approveStudent,
  viewApprovedAccounts,
  getAdviser,
  pendingApplicationStudent,
  getCounts,
  uploadCsv
};
