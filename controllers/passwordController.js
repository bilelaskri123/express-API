const { User } = require("../models/User");
const jwt = require("jsonwebtoken");

module.exports.sendForgotPasswordLink = async (req, res, next) => {
  try {
    // Implementation for resetting the password
    const user = await User.findOne({ emai: req.body.email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    // Here you would typically generate a reset token and send an email
    const secret = process.env.JWT_SECRET + user.password;
    const payload = {
      id: user._id,
      email: user.email,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "15m" });
    const resetLink = `http://localhost:3000/reset-password/${user._id}/${token}`;
    // Send email logic goes here (omitted for brevity)
    res.status(200).json({ message: "Password reset link sent.", resetLink });
  } catch (err) {
    next(err);
  }
};

module.exports.verifyResetToken = async (req, res, next) => {
  try {
    const { id, token } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const secret = process.env.JWT_SECRET + user.password;
    try {
      jwt.verify(token, secret);
      res.status(200).json({ message: "Token is valid." });
    } catch (err) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.resetPassword = async (req, res, next) => {
  try {
    const { id, token } = req.params;
    const { newPassword } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const secret = process.env.JWT_SECRET + user.password;
    try {
      jwt.verify(token, secret);
    } catch (err) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (err) {
    next(err);
  }
};
