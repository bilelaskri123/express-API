const express = require("express");
const router = express.Router();
const isAdmin = require("../middlewares/isAdmin");
const asyncHandler = require("../middlewares/asyncHandler");
const bookController = require("../controllers/bookController");

// Create a new book
/**
 * @desc Create a new book
 * @route POST /books
 * @access Private (only admins should be able to create books)
 */
router.post("/", isAdmin, asyncHandler(bookController.createBook));

// Get all books
/**
 * @desc Get all books
 * @route GET /books
 * @access Public
 */
router.get("/", asyncHandler(bookController.getBooks));

// Get book by ID
/**
 * @desc Get a book by ID
 * @route GET /books/:id
 * @access Public
 */
router.get("/:id", asyncHandler(bookController.getBookById));

// Update book by ID
/**
 * @desc Update a book
 * @route PUT /books/:id
 * @access Private (only admins should be able to update books)
 */
router.put("/:id", isAdmin, asyncHandler(bookController.updateBook));

// Delete book by ID
/**
 * @desc Delete a book
 * @route DELETE /books/:id
 * @access Private (only admins should be able to delete books)
 */
router.delete("/:id", isAdmin, asyncHandler(bookController.deleteBook));

module.exports = router;
