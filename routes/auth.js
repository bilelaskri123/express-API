const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { User, userCreatingSchema, userLoginSchema } = require("../models/User");

const asyncHandler = require("../middlewares/asyncHandler");
const authController = require("../controllers/authController");

// Register a new user
router.post("/register", asyncHandler(authController.register));

// Login user
/**
 * @desc Login a user
 * @route POST /auth/login
 * @access Public
 */
router.post("/login", asyncHandler(authController.login));

module.exports = router;
