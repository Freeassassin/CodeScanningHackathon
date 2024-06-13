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

  const issues = await IssueModel.find({});

  for (const issue of issues) {
    if (
      !req.body.results.some(
        (result) =>
          issue.primaryLocationLineHash ==
            result.partialFingerprints.primaryLocationLineHash &&
          issue.primaryLocationStartColumnFingerprint ==
            result.partialFingerprints.primaryLocationStartColumnFingerprint
      )
    ) {
      if (issue.assigned !== "no") {
        let score = 0;
        if (issue.done === true) score = 250;
        else score = 1000 + 500 * issue.persistent + 250;
        await UserModel.findOneAndUpdate(
          { username: issue.assigned },
          {
            $inc: {
              score,
            },
          }
        );
      }
      writes.push({
        deleteOne: {
          filter: {
            primaryLocationLineHash: issue.primaryLocationLineHash,
            primaryLocationStartColumnFingerprint:
              issue.primaryLocationStartColumnFingerprint,
          },
        },
      });
    }
  }
  await IssueModel.bulkWrite(writes).then((res) => {
    console.log(res.insertedCount, res.modifiedCount, res.deletedCount);
  });
  res.status(200);
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  const existingUser = await UserModel.findOne({ username: req.body.username });
  if (!existingUser) {
    const user = await UserModel.create(req.body);
    return res.status(200).send({ user });
  }
  return res.status(200).send({ user: existingUser });
});

app.post("/issue", async (req, res) => {
  console.log(req.body);
  const issue = await IssueModel.findOneAndUpdate(
    { _id: req.body.id },
    { falsePositive: true }
  );
  const user = await UserModel.findOneAndUpdate(
    {
      username: req.body.username,
    },
    {
      $inc: {
        score: 500,
      },
    }
  );
  res.status(200).send({ issue, user });
});

app.post("/assign", async (req, res) => {
  console.log(req.body);
  const issue = await IssueModel.findOneAndUpdate(
    { _id: req.body.id },
    { assigned: req.body.username }
  );

  res.status(200).send({ issue });
});

app.post("/done", async (req, res) => {
  console.log(req.body);
  const issue = await IssueModel.findOneAndUpdate(
    { _id: req.body.id },
    { done: true }
  );

  const user = await UserModel.findOneAndUpdate(
    {
      username: req.body.username,
    },
    {
      $inc: {
        score: 1000 + 500 * issue.persistent,
      },
    }
  );
  const issues = await IssueModel.find({
    assigned: req.body.username,
    done: false,
  });
  res.status(200).send({ issues, user });
});

app.post("/assigned", async (req, res) => {
  console.log(req.body);
  const issues = await IssueModel.find({
    assigned: req.body.username,
    done: false,
  });
  res.status(200).send({ issues });
});

app.get("/leaderboard", async (req, res) => {
  const users = await UserModel.find({}).sort({ score: -1 });
  res.status(200).send({ users: users });
});

app.get("/issues", async (req, res) => {
  const issues = await IssueModel.find({
    assigned: "no",
    falsePositive: false,
  });

  res.status(200).send({ issues });
});

app.get("*", (req, res) => {
  res.status(200).send("hello");
});

const server = http.createServer(app);

server.listen(process.env.PORT || 5001, () => {
  console.log(`Server is running on: ${process.env.API_BASE_URL}`);
});
