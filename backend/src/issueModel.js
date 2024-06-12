const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    eventName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    link: {
      type: String,
      required: false,
    },
    linkLabel: {
      type: String,
      required: false,
    },
  },
  { strict: true, timestamps: true }
);

const IssueModel = mongoose.model("Issue", IssueSchema);

module.exports = IssueModel;
