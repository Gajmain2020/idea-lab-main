require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const jwt = require("jsonwebtoken");
require("./db/conn");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const authStudent = require("./middleware/authStudent");
const authTeacher = require("./middleware/authTeacher");

const Register = require("./models/registers");
const RegisterTeacher = require("./models/registers-teacher");
const Quizes = require("./models/quiz");
const Questions = require("./models/questions");
const { checkPrime } = require("crypto");

const oneDay = 24 * 3600000; //1 weeks

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(cookieParser());
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
app.get("/logged-in-teacher", authTeacher, (req, res) => {
  res.render("logged-in-teacher");
});
app.get("/give-test", authStudent, async (req, res) => {
  const questions = await Questions.find();
  res.status(200).render("give-test", { questions });
});

app.get("/logout-student", authStudent, async (req, res) => {
  try {
    console.log(req.user);
    req.user.tokens = [];

    res.clearCookie("jwt");
    console.log(`logout succesfully`);

    await req.user.save();
    res.render("login-or-reg-student");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/logout-teacher", authTeacher, async (req, res) => {
  try {
    req.user.tokens = [];

    res.clearCookie("jwt");
    console.log(`logout succesfully`);

    await req.user.save();
    res.render("login-or-reg-teacher");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/logged-in-student", authStudent, (req, res) => {
  res.render("logged-in-teacher");
});

app.get("/create-question", authTeacher, (req, res) => {
  res.render("questionForm");
});

// app.get("/create-quiz", (req, res) => {
//   res.render("sem-sec-form");
// });

//create new student in db
app.post("/register-student", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.cpassword;

    if (password === cpassword) {
      const registerStudent = new Register({
        fullname: req.body.fullname,
        email: req.body.email,
        sem: req.body.sem,
        rno: req.body.rno,
        password: req.body.password,
        cpassword: req.body.cpassword,
        gender: req.body.gender,
      });

      //   concept of middle ware

      const token = await registerStudent.generateAuthToken();

      res.cookie("jwt", token, {
        // var hour = 3600000;

        expires: new Date(Date.now() + oneDay),
      });

      //password hashing
      const register = await registerStudent.save();
      res.status(201).render("login-or-reg-student");
    } else {
      res.send("Password not matching");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

//create new teacher in db
app.post("/register-teacher", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.cpassword;

    if (password === cpassword) {
      const registerTeacher = new RegisterTeacher({
        fullname: req.body.fullname,
        tid: req.body.tid,
        email: req.body.email,
        dept: req.body.dept,
        password: req.body.password,
        cpassword: req.body.cpassword,
      });

      //   concept of middle ware

      const token2 = await registerTeacher.generateAuthToken2();

      res.cookie("jwt", token2, {
        expires: new Date(Date.now() + oneDay),
      });

      //password hashing
      const registerteacher = await registerTeacher.save();
      res.status(201).render("login-or-reg-teacher");
    } else {
      res.send("Password not matching");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// login chk
app.post("/login-student", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userEmail = await Register.findOne({ email: email });
    const isMatch = await bcrypt.compare(password, userEmail.password);
    const token = await userEmail.generateAuthToken();

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + oneDay),
      // secure: true,
    });

    // console.log(userEmail.password, password);
    // console.log(isMatch);
    if (isMatch) {
      res.status(201).render("logged-in-student");
    } else {
      res.send("invalid login details");
    }
  } catch (error) {
    res.status(400).send("invalid login details");
  }
});
app.post("/login-teacher", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userEmail = await RegisterTeacher.findOne({ email: email });
    const isMatch = await bcrypt.compare(password, userEmail.password);
    const token2 = await userEmail.generateAuthToken2();

    res.cookie("jwt", token2, {
      expires: new Date(Date.now() + oneDay),
      // secure: true,
    });

    console.log(`this is cookie ${req.cookies.jwt}`);

    if (isMatch) {
      res.status(201).render("logged-in-teacher");
    } else {
      res.send("invalid login details");
    }
  } catch (error) {
    res.status(400).send("invalid login details");
  }
});

app.post("/create-quiz", async (req, res) => {
  const { semester, section, name } = req.body;
  try {
    const quiz = new Quizes({
      semester,
      name,
      section,
      questions: [],
      created_by: "teacher 1", // get this from cookie
    });
    await quiz.save();
    res.status(201).render("questionForm", { quizId: quiz._id });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
});

app.get("/all-quizes", async (req, res) => {
  const quiz = await Quizes.find();
  res.status(200).send(quiz);
});

app.post("/add-question", async (req, res) => {
  const { question, option1, option2, option3, option4, correctOption } =
    req.body;
  try {
    const questions = new Questions({
      question,
      options: [option1, option2, option3, option4],
      correct_option: Number(correctOption),
    });
    await questions.save();
    res.status(201).render("questionForm");
  } catch (error) {
    console.log("something went wrong", error);
  }
});

app.post("/submit-test", authStudent, async (req, res) => {
  const ans = req.body;
  // const user = await Register.findOne({ "tokens.token": req.cookies.jwt });
  // console.log(user);
  const score = Object.keys(ans).reduce(async (result, key) => {
    const question = await Questions.findOne({ _id: key });
    if (question.correct_option === Number(ans[key])) {
      result += 1;
    }
  }, 0);
  await Register.updateOne(
    { "tokens.token": req.cookies.jwt },
    { $set: { score } }
  );
  res.redirect("/login-student");
});

app.listen(port, () => {
  console.log(`server started :: http://localhost:${port}`);
});
