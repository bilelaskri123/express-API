const express = require("express");
const router = express.Router();
const {
  Author,
  authorCreatingSchema,
  authorUpdateSchema,
} = require("../models/Author");
const isAdmin = require("../middlewares/isAdmin");

// Create a new author
/**
 * @desc Create a new author
 * @route POST /authors
 * @access Private (only admins should be able to create authors)
 */
router.post("/", isAdmin, async (req, res) => {
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
/**
 * @desc Get all authors
 * @route GET /authors
 * @access Public
 */
router.get("/", async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).json(authors);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get author by ID
/**
 * @desc Get an author by ID
 * @route GET /authors/:id
 * @access Public
 */
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
/**
 * @desc Update an author
 * @route PUT /authors/:id
 * @access Private (only admins should be able to update authors)
 */
router.put("/:id", isAdmin, async (req, res) => {
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
/**
 * @desc Delete an author
 * @route DELETE /authors/:id
 * @access Private (only admins should be able to delete authors)
 */
router.delete("/:id", isAdmin, async (req, res) => {
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
