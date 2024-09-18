const express = require("express");
const router = express.Router();
const ContentModel = require("../models/contentModel"); // Capitalize the model name for consistency
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize GoogleGenerativeAI with your API key
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Root endpoint to check server status
router.get("/", (req, res) => {
  res.send("Hello Gemini, the server is up and running!");
});

// Helper function to generate content
const generateContent = async (prompt) => {
  try {
    const result = await model.generateContent(prompt); // Call the API to generate content
    return result.response.text(); // Extract and return the generated text
  } catch (error) {
    console.error("Error generating content:", error); // Log the error for debugging
    throw new Error("Failed to generate content. Please try again."); // Provide a user-friendly error message
  }
};

// POST route to generate AI content and save it to the database
router.post("/api/content", async (req, res) => {
  try {
    const { question: prompt } = req.body;

    // Validate that the prompt is provided
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return res
        .status(400)
        .json({ error: "Prompt is required and must be a non-empty string." });
    }

    // Generate content based on the provided prompt
    const responseText = await generateContent(prompt);

    // Save the generated response to the database
    const content = new ContentModel({
      prompt: prompt.trim(), // Trim the prompt to avoid storing unnecessary whitespace
      generatedResponse: responseText,
    });

    // Save the document to the database
    await content.save();

    // Respond with the saved content
    res.status(200).json({ result: content });
  } catch (error) {
    console.error("Error handling content generation:", error); // Log error details for debugging
    res.status(500).json({
      error: "An error occurred while generating content. Please try again.",
    });
  }
});

module.exports = router;
