const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const registerSchemaTeacher = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  tid: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dept: {
    type: String,
    values: ["CSE", "MECH", "EE", "EEE", "CIVIL", "ETC", "IT"],
    required: true,
  },

  password: {
    type: String,
    required: true,
    // unique: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
});

registerSchemaTeacher.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);

    this.cpassword = undefined;
  }
  next();
});

//collection

const RegisterTeacher = new mongoose.model(
  "Registered-Teacher",
  registerSchemaTeacher
);

module.exports = RegisterTeacher;
