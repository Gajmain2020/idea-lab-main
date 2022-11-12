const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const registerSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    // unique: true,
  },
  sem: {
    type: String,
    values: [
      "3A",
      "3B",
      "4A",
      "4B",
      "5A",
      "5B",
      "6A",
      "6B",
      "7A",
      "7B",
      "8A",
      "8B",
    ],
    required: true,
  },

  rno: {
    type: Number,
    require: true,
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
  gender: {
    type: String,
    required: true,
    values: ["Male", "female"],
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

const Register = new mongoose.model("Registered-Student", registerSchema);

module.exports = Register;
