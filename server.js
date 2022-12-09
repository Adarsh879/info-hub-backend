const express = require("express");
const bodyparser = require("body-parser");
var router = express.Router();
const mongoose = require("mongoose");
// const cookieParser = require("cookie-parser");
const cors = require("cors");
const config = require("./config");

const connect = (url) => {
  return mongoose.connect(url);
};

var app = express();
app.use(
  bodyparser.urlencoded({
    extended: false,
  })
);
app.use(bodyparser.json());
app.use(router);
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Starting server
app.listen(process.env.PORT || 5000, function () {
  console.log("Server, listening on port 5000");
});

connect(config.db.prod);
mongoose.connection.on("error", console.log);

//endpoints
router.get("/", function (req, res, next) {
  res.status(200).json({ message: "Default Route works" });
});

//router
app.use("/api", require("./src/config/routes"));

//error interceptor
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message,
  });
});
