const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const QuizSchema = new mongoose.Schema({
  semester: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
    // unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  created_by: {
    type: String,
    required: true,
  },
  questions: {
    type: Array,
    require: true,
  },
});

QuizSchema.pre("save", async function (next) {
  // if (this.isModified("password")) {
  //   this.password = await bcrypt.hash(this.password, 10);

  //   this.cpassword = undefined;
  // }
  next();
});

//collection

const Quiz = new mongoose.model("quizes", QuizSchema);

module.exports = Quiz;
