import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  first_name: { type: String, required: true },
  middle_name: { type: String, required: true },
  last_name: { type: String, required: true },
  student_number: { type: String },
  employee_number: { type: String },
  user_type: { type: String, required: true },
  applications: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
  },
  adviser: { type: { type: mongoose.Schema.Types.ObjectId, ref: "User" } },
  user_status: { type: String, required: true, default: "pending" },
});

UserSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) {
      return next(saltError);
    }

    return bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) {
        return next(hashError);
      }

      user.password = hash;
      return next();
    });
  });
});

UserSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, callback);
};

export default mongoose.model("User", UserSchema);
