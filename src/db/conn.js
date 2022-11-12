const mongoose = require("mongoose");

// const DB = ;

mongoose
  .connect("mongodb://localhost:27017/register", {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
  })
  .then(() => {
    console.log(`connnection successful`);
  })
  .catch((err) => console.log(err));

// mongoose
//   .connect("mongodb://localhost:27017/teacher-student", {
//     useNewUrlParser: true,
//     // useCreateIndex: true,
//     useUnifiedTopology: true,
//     // useFindAndModify: false,
//   })
//   .then(() => {
//     console.log(`connnection successful`);
//   })
//   .catch((err) => console.log(err));
