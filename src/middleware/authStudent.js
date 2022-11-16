const jwt = require("jsonwebtoken");
const Register = require("../models/registers");

const authStudent = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY);

    const user = await Register.findOne({ _id: verifyUser._id });

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("Please Login To View This Page");
  }
};

module.exports = authStudent;
