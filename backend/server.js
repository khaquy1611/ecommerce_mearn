const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const dbConnect = require("./config/dbconnect");
const initRoute = require("./routes");
const cors = require("cors");

const app = express();
app.use(
  cors({
    AccessControlAllowOrigin: "*",
    origin: process.env.CLIENT_APP_URL,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  })
);

const port = process.env.PORT || 8888;
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
