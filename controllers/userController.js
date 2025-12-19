const { User, userUpdateSchema } = require("../models/User");

exports.getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.status(200).json(user);
};

exports.updateUser = async (req, res) => {
  const { error, value } = userUpdateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const updatedUser = await User.findByIdAndUpdate(req.params.id, value, {
    new: true,
  }).select("-password");
  if (!updatedUser) return res.status(404).json({ error: "User not found" });
  res.status(200).json(updatedUser);
};

exports.deleteUser = async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  if (!deletedUser) return res.status(404).json({ error: "User not found" });
  res.status(200).json({ message: "User deleted successfully" });
};
