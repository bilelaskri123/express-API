const express = require("express");
const router = express.Router();
const {
  Book,
  bookCreatingSchema,
  bookUpdateSchema,
} = require("../models/Book");
const isAdmin = require("../middlewares/isAdmin");

// Create a new book
/**
 * @desc Create a new book
 * @route POST /books
 * @access Private (only admins should be able to create books)
 */
router.post("/", isAdmin, async (req, res) => {
  try {
    const { error, value } = bookCreatingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const newBook = new Book(value);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get all books
/**
 * @desc Get all books
 * @route GET /books
 * @access Public
 */
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().populate("author");
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get book by ID
/**
 * @desc Get a book by ID
 * @route GET /books/:id
 * @access Public
 */
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("author", [
      "firstName",
      "lastName",
      "_id",
    ]);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update book by ID
/**
 * @desc Update a book
 * @route PUT /books/:id
 * @access Private (only admins should be able to update books)
 */
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const { error, value } = bookUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, value, {
      new: true,
    });
    if (!updatedBook) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json(updatedBook);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete book by ID
/**
 * @desc Delete a book
 * @route DELETE /books/:id
 * @access Private (only admins should be able to delete books)
 */
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
