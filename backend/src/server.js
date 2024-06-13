const http = require("http");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const IssueModel = require("./issueModel");
const UserModel = require("./userModel");

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

app.post("/upload", async (req, res) => {
  let writes = [];
  for (const result of req.body.results) {
    const persistent = await IssueModel.findOne({
      primaryLocationLineHash:
        result.partialFingerprints.primaryLocationLineHash,
      primaryLocationStartColumnFingerprint:
        result.partialFingerprints.primaryLocationStartColumnFingerprint,
    });
    console.log(persistent);
    if (persistent) {
      writes.push({
        updateOne: {
          filter: {
            primaryLocationLineHash:
              result.partialFingerprints.primaryLocationLineHash,
            primaryLocationStartColumnFingerprint:
              result.partialFingerprints.primaryLocationStartColumnFingerprint,
          },
          update: {
            $inc: {
              persistent: 1,
            },
          },
        },
      });
    } else {
      writes.push({
        insertOne: {
          document: {
            ruleId: result.ruleId,
            ruleIndex: result.ruleIndex,
            message: result.message.text,
            location: result.locations[0].physicalLocation,
            primaryLocationLineHash:
              result.partialFingerprints.primaryLocationLineHash,
            primaryLocationStartColumnFingerprint:
              result.partialFingerprints.primaryLocationStartColumnFingerprint,
          },
        },
      });
    }
  }
  await IssueModel.bulkWrite(writes).then((res) => {
    console.log(res.insertedCount, res.modifiedCount, res.deletedCount);
  });
  // TODO: check which issues didnt persist and delete them/ assign points
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
  const issues = await IssueModel.find({ assigned: "no" });

  res.status(200).send({ issues });
});


app.get("*", (req, res) => {
  res.status(200).send("hello");
});

const server = http.createServer(app);

server.listen(process.env.PORT || 5001, () => {
  console.log(`Server is running on: ${process.env.API_BASE_URL}`);
});
