const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  correct_option: {
    type: Number,
    require: true,
  },
});

QuestionSchema.pre("save", async function (next) {
  next();
});

const Question = new mongoose.model("questions", QuestionSchema);

module.exports = Question;
