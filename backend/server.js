const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const dbConnect = require("./config/dbconnect");
const initRoute = require("./routes");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8888;
// enable cors
app.use(
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.options(
  '*',
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
dbConnect();
initRoute(app);

app.use("/", (req, res) => {
  res.send("SERVER chạy");
});

app.listen(port, () => {
  console.log("SERVER đang chạy ở cổng: ", port);
});
