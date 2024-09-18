const mongoose = require("mongoose");
require("dotenv").config();

// const mongoURL = process.env.MONGODB_URL_LOCAL;
const mongoURL = process.env.MONGODB_URL_GLOBAL;
mongoose.connect(mongoURL);

const db = mongoose.connection;

// event listiners
db.on("connected", () => {
  console.log("Connected to MongoDB");
});

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

module.exports = db;
