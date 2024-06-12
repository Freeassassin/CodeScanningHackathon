const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");

const app = express();

const corsOptions = {
  credentials: true,
  origin: [
    process.env.CLIENT_BASE_URL,
    process.env.API_BASE_URL,
    "https://checkout.stripe.com",
    "https://www.orientation.skule.ca",
  ],
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
console.log("Loading mongo...");
const { MONGODB_PASSWORD, MONGODB_HOST, MONGODB_USER } = process.env;
const mongoURI = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${
  process.env.NODE_ENV === "production" ? MONGODB_HOST : "mongo"
}:27017/orientation?authSource=admin`;
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
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

// const upload = multer({ storage });
var upload = multer({ storage: storage })
app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file);
  res.status(200);
});

app.get("*", (req, res) => {
  res.status(200).send("hello");
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST", "PUT", "PATCH", "DELETE"] },
});

server.listen(process.env.PORT || 5001, () => {
  console.log(`Server is running on: ${process.env.API_BASE_URL}`);
});
