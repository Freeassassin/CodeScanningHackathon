const http = require("http");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const IssueModel = require("./issueModel");
const UserModel = require("./userModel");
const { userInfo } = require("os");

const app = express();

const corsOptions = {
  credentials: true,
  origin: [
    process.env.CLIENT_BASE_URL,
    process.env.API_BASE_URL,
    "http://127.0.0.1:5173",
  ],
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
console.log("Loading mongo...");
const { MONGODB_PASSWORD, MONGODB_USER } = process.env;
const mongoURI = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@mongo:27017/project?authSource=admin`;
mongoose.connect(mongoURI);
// mongoose.set('debug', true); // uncomment this if you have issues with mongo and want to debug
console.log("Connected to mongo!");
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.USER_SESSION_SECRET,
    store: new MongoStore({
      mongoUrl: mongoURI,
      crypto: { secret: process.env.SESSION_SECRET },
    }),
  })
);

// routes
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

// const upload = multer({ storage });
var upload = multer({ storage: storage });
app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file);
  res.status(200);
});

app.post("/user", async (req, res) => {
  console.log(req.body);
  await UserModel.create(req.body.user);
  res.status(200);
});

app.get("/leaderboard", async (req, res) => {
  const users = await UserModel.find({}).sort({ score: -1 });
  res.status(200).send({ users: users });
});

app.get("/issues", async (req, res) => {
  const issues = await IssueModel.find({});

  res.status(200).send({ issues });
});

app.get("*", (req, res) => {
  res.status(200).send("hello");
});

const server = http.createServer(app);

server.listen(process.env.PORT || 5001, () => {
  console.log(`Server is running on: ${process.env.API_BASE_URL}`);
});
