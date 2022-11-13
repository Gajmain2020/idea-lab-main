const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// generating tokens
registerSchemaTeacher.methods.generateAuthToken2 = async function () {
  try {
    const token2 = jwt.sign(
      { _id: this._id.toString() },
      "abcdefghijklmnopqrstuvwxyzgajendra"
    );
    this.tokens = this.tokens.concat({ token: token2 });
    await this.save();
    return token2;
  } catch (error) {
    res.send("The Error Part" + error);
    console.log("The Error Part" + error);
  }
};

//hashing password
registerSchemaTeacher.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);

    this.cpassword = await bcrypt.hash(this.password, 10);
  }
  next();
});

//collection

const RegisterTeacher = new mongoose.model(
  "Registered-Teacher",
  registerSchemaTeacher
);

module.exports = RegisterTeacher;
