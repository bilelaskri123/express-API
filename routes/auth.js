const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { User, userCreatingSchema, userLoginSchema } = require("../models/User");

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { error, value } = userCreatingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // Hash the password before saving
    // const salt = await bcrypt.genSalt(10);
    // value.password = await bcrypt.hash(value.password, salt);

    const newUser = new User(value);
    const savedUser = await newUser.save();

    // sign token
    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password, ...userWithoutPassword } = savedUser.toObject();
    res.status(201).json({ user: userWithoutPassword, token });
    // res.status(201).json(savedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login user
/**
 * @desc Login a user
 * @route POST /auth/login
 * @access Public
 */
router.post("/login", async (req, res) => {
  try {
    const { error, value } = userLoginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const user = await User.findOne({ email: value.email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    // Verify password
    const isPasswordValid = await user.comparePassword(value.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password, ...userWithoutPassword } = user.toObject();
    res
      .status(200)
      .json({ message: "Login successful", user: userWithoutPassword, token });
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
