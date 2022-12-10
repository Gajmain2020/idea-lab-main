const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  score: {
    type: Number,
  },
});

// generating tokens
registerSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    );
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    res.send("The Error Part" + error);
    console.log("The Error Part" + error);
  }
};

// hashing password
registerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);

    this.cpassword = await bcrypt.hash(this.password, 10);
  }
  next();
});

//collection

const Register = new mongoose.model("Registered-Student", registerSchema);

module.exports = Register;
