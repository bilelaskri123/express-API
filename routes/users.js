const express = require("express");
const router = express.Router();
const asyncHandler = require("../middlewares/asyncHandler");
const isAdmin = require("../middlewares/isAdmin");
const isAdminOrhasId = require("../middlewares/isAdminOrhasId");
const userController = require("../controllers/userController");

// Get all users
/**
 * @desc Get all users
 * @route GET /users
 * @access Private
 */
router.get("/", isAdmin, asyncHandler(userController.getUsers));

// Get user by ID
/**
 * @desc Get a user by ID
 * @route GET /users/:id
 * @access Private
 */
router.get("/:id", isAdminOrhasId, asyncHandler(userController.getUserById));

// Update user by ID
/**
 * @desc Update a user
 * @route PUT /users/:id
 * @access Private
 */
router.put("/:id", isAdminOrhasId, asyncHandler(userController.updateUser));

// Delete user by ID
/**
 * @desc Delete a user
 * @route DELETE /users/:id
 * @access Private
 */
router.delete("/:id", isAdminOrhasId, asyncHandler(userController.deleteUser));

module.exports = router;
