const express = require("express");
const router = express.Router();
const { User, userUpdateSchema } = require("../models/User");
const verifyToken = require("../middlewares/verifyToken");

// Get all users
/**
 * @desc Get all users
 * @route GET /users
 * @access Private
 */
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get user by ID
/**
 * @desc Get a user by ID
 * @route GET /users/:id
 * @access Private
 */
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update user by ID
/**
 * @desc Update a user
 * @route PUT /users/:id
 * @access Private
 */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { error, value } = userUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, value, {
      new: true,
    }).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete user by ID
/**
 * @desc Delete a user
 * @route DELETE /users/:id
 * @access Private
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
