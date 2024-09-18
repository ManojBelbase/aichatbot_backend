const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const db = require("../chatBotBackend/db");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.get("/getData", (req, res) => {
  res.send("hello client i'm how are you");
});

// Importing router files
const chatbotRoutes = require("./routes/ChatbotRoute");
app.use("/", chatbotRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
