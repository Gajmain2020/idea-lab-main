const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
require("./db/conn");
const bcrypt = require("bcryptjs");

const Register = require("./models/registers");
const { checkPrime } = require("crypto");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
  res.render("homepage");
});

app.get("/login-or-reg-teacher", (req, res) => {
  res.render("login-or-reg-teacher");
});
app.get("/login-or-reg-student", (req, res) => {
  res.render("login-or-reg-student");
});

app.get("/register-teacher", (req, res) => {
  res.render("register-teacher");
});
app.get("/register-student", (req, res) => {
  res.render("register-student");
});

app.get("/login-student", (req, res) => {
  res.render("login-student");
});

app.get("/login-teacher", (req, res) => {
  res.render("login-teacher");
});

//create new user in db
app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.cpassword;

    if (password === cpassword) {
      const registerStudent = new Register({
        fullname: req.body.fullname,
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
        password: password,
        cpassword: cpassword,
      });

      //password hashing
      //   concept of middle ware

      const register = await registerStudent.save();
      res.status(201).render("index");
    } else {
      res.send("Password not matching");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// login chk
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userEmail = await Register.findOne({ email: email });

    const isMatch = await bcrypt.compare(userEmail.password, password);

    if (isMatch) {
      res.status(201).render("index");
    } else {
      res.send("invalid login details");
    }
  } catch (error) {
    res.status(400).send("invalid login details");
  }
});

app.listen(port, () => {
  console.log(`server is running at port :: ${port}`);
});
