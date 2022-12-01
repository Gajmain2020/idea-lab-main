const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/register", {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
  })
  .then(() => {
    console.log(`DB connnection successful`);
  })
  .catch((err) => console.log(err));
