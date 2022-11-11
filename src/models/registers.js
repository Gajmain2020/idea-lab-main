const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const registerSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    // unique: true,
  },
  email: {
    type: String,
    required: true,
    // unique: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
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

registerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);

    this.cpassword = undefined;
  }
  next();
});

//collection

const Register = new mongoose.model("Student", registerSchema);

module.exports = Register;
