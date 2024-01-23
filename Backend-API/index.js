import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import "swagger-ui-express";

// import UserSchema from "./models/user.js";
import "./models/user.js";

import express from "express";

await mongoose.connect("mongodb://127.0.0.1:27017/ICS", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Initialize server
const app = express();

// Plugin for reading JSON payloads
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import router
import router from "./router.js";
router(app);

// Server listens at Port 3001
app.listen(3001, () => {
  console.log("API listening at port 3001.");
});
