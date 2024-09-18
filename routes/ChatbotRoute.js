const express = require("express");
const router = express.Router();
const ContentModel = require("../models/contentModel");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.get("/", (req, res) => {
  res.send("Hello Gemini, the server is up and running!");
});

const generateContent = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content. Please try again.");
  }
};

router.post("/api/content", async (req, res) => {
  try {
    const { question: prompt } = req.body;
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return res
        .status(400)
        .json({ error: "Prompt is required and must be a non-empty string." });
    }

    const responseText = await generateContent(prompt);

    const content = new ContentModel({
      prompt: prompt.trim(),
      generatedResponse: responseText,
    });

    await content.save();

    res.status(200).json({ result: content });
  } catch (error) {
    console.error("Error handling content generation:", error);
    res.status(500).json({
      error: "An error occurred while generating content. Please try again.",
    });
  }
});

module.exports = router;
