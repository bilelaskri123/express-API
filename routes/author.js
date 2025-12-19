const express = require("express");
const router = express.Router();
const isAdmin = require("../middlewares/isAdmin");
const asyncHandler = require("../middlewares/asyncHandler");
const authorController = require("../controllers/authorController");

// Create a new author
/**
 * @desc Create a new author
 * @route POST /authors
 * @access Private (only admins should be able to create authors)
 */
router.post("/", isAdmin, asyncHandler(authorController.createAuthor));

// Get all authors
/**
 * @desc Get all authors
 * @route GET /authors
 * @access Public
 */
router.get("/", asyncHandler(authorController.getAuthors));

// Get author by ID
/**
 * @desc Get an author by ID
 * @route GET /authors/:id
 * @access Public
 */
router.get("/:id", asyncHandler(authorController.getAuthorById));

// Update author by ID
/**
 * @desc Update an author
 * @route PUT /authors/:id
 * @access Private (only admins should be able to update authors)
 */
router.put("/:id", isAdmin, asyncHandler(authorController.updateAuthor));

// Delete author by ID
/**
 * @desc Delete an author
 * @route DELETE /authors/:id
 * @access Private (only admins should be able to delete authors)
 */
router.delete("/:id", isAdmin, asyncHandler(authorController.deleteAuthor));

module.exports = router;
