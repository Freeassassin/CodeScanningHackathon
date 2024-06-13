const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema({
  ruleId: {
    type: String,
    required: true,
  },
  ruleIndex: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  location: {
    type: {
      artifactLocation: {
        type: {
          uri: {
            type: String,
            required: true,
          },
          uriBaseId: {
            type: String,
            required: true,
          },
          index: {
            type: Number,
            required: true,
          },
        },
      },
      region: {
        type: {
          startLine: {
            type: Number,
            required: true,
          },
          startColumn: {
            type: Number,
            required: true,
          },
          endColumn: {
            type: Number,
            required: true,
          },
        },
      },
    },
    required: true,
  },
  primaryLocationLineHash: {
    type: String,
    required: true,
  },
  primaryLocationStartColumnFingerprint: {
    type: Number,
    required: true,
  },
  falsePositive: {
    type: Boolean,
    required: true,
    default: false,
  },
  assigned: {
    type: String,
    required: true,
    default: "no",
  },
  persistent: {
    type: Number,
    required: true,
    default: 0,
  },
});

const IssueModel = mongoose.model("Issue", IssueSchema);

module.exports = IssueModel;
