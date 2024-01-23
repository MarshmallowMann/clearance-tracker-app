import { login, checkIfLoggedIn, signUp } from "./auth_controller.js";
import {
  openApplication,
  closeApplication,
  printApplication,
  viewSingleApplication,
  submitAdviser,
  submitOfficer,
  resubmitAtCurrStep,
  viewAllApplications,
  clearApplication,
} from "./student_controller.js";

import swaggerUi from "swagger-ui-express";
import swaggerJSDocs from "swagger-jsdoc";
import {
  assignAdviser,
  createApprover,
  deleteApprover,
  editApprover,
  // getApproverByName,
  handleAccount,
  listApprover,
  viewPendingAccounts,
  viewApprovedAccounts,
  listApplications,
  rejectStudent,
  approveStudent,
  getAdviser,
  pendingApplicationStudent,
  getCounts,
  uploadCsv,
} from "./admin_controller.js";

import {
  viewPendingApplications,
  viewAdvisees,
  viewSingleApplicationApprover,
  approveApplication,
  disapproveApplication,
} from "./approver_controller.js";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "ICS Clearance System API",
    version: "1.0.0",
    description:
      "This is a REST API application made with Express. It retrieves data from a mongoDB database and returns it as JSON. Made in fullfillment of CMSC 100 project requirements.",
    license: {
      name: "Licensed Under MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "CMSC 100 UV1L Group 4",
      email: "jcdespi@up.edu.ph",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["./routes/*.js", "auth_controller.js"],
};

const swaggerSpec = swaggerJSDocs(options);

export default function router(app) {
  // Allow Cross Origin Resource Sharing
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,HEAD,OPTIONS,POST,PUT,DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Requested-With,Cookie,Set-Cookie"
    );
    next();
  });
  // Auth_controller routes
  app.post("/login", login);
  app.post("/check-if-logged-in", checkIfLoggedIn);
  app.post("/sign-up", signUp);

  
  app.get("/view-pending-accounts", viewPendingAccounts),
    app.get("/view-approved-accounts", viewApprovedAccounts),
    // Admin_controller routes
    app.post("/handle-account", handleAccount),
    app.post("/assign-adviser", assignAdviser),
    app.post("/create-approver", createApprover),
    app.post("/edit-approver", editApprover),
    app.post("/delete-approver", deleteApprover),
    app.get("/get-counts", getCounts),
    app.post("/upload-csv", uploadCsv),
    // app.get("/get-approver-by-name", getApproverByName),
    app.get("/list-approvers", listApprover),
    app.get("/list-applications", listApplications),
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.post("/approve-student", approveStudent);
    app.post("/reject-student", rejectStudent);
    app.get("/get-adviser", getAdviser);
    app.post("/get-student-application-pending", pendingApplicationStudent);

  // student_controller routes
  app.post("/student/open-application", openApplication);
  app.post("/student/close-application", closeApplication);
  app.post("/student/view-single-application", viewSingleApplication);
  app.post("/student/submit-adviser", submitAdviser);
  app.post("/student/submit-officer", submitOfficer);
  app.post("/student/resubmit-at-curr-step", resubmitAtCurrStep);
  app.post("/student/view-all-applications", viewAllApplications);
  app.post("/student/print-application", printApplication);
  app.post("/student/clear-application", clearApplication);
  app.post("/student/print-application", printApplication);

  // approver_controller routes
  app.post("/approver/view-pending-applications", viewPendingApplications);
  app.post("/approver/view-single-application", viewSingleApplicationApprover);
  app.post("/approver/approve-application", approveApplication);
  app.post("/approver/disapprove-application", disapproveApplication);
  app.post("/approver/view-advisees", viewAdvisees);
}
