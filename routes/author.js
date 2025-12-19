const express = require("express");
const router = express.Router();
const {
  Author,
  authorCreatingSchema,
  authorUpdateSchema,
} = require("../models/Author");

// Create a new author
router.post("/", async (req, res) => {
  try {
    const { error, value } = authorCreatingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const newAuthor = new Author(value);
    const savedAuthor = await newAuthor.save();
    res.status(201).json(savedAuthor);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get all authors
router.get("/", async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).json(authors);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get author by ID
router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }
    res.status(200).json(author);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update author by ID
router.put("/:id", async (req, res) => {
  try {
    const { error, value } = authorUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, value, {
      new: true,
    });
    if (!updatedAuthor) {
      return res.status(404).json({ error: "Author not found" });
    }
    res.status(200).json(updatedAuthor);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete author by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
    if (!deletedAuthor) {
      return res.status(404).json({ error: "Author not found" });
    }
    res.status(200).json({ message: "Author deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
