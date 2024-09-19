const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
  },
  generatedResponse: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Creating a model for the content schema
const Content = mongoose.model("Content", contentSchema);
module.exports = Content;
