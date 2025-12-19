const bcrypt = require("bcryptjs");
const { User, userCreatingSchema, userLoginSchema } = require("../models/User");

exports.register = async (req, res) => {
  const { error, value } = userCreatingSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const existingUser = await User.findOne({ email: value.email });
  if (existingUser)
    return res.status(409).json({ error: "Email already in use" });

  const newUser = new User(value);
  const savedUser = await newUser.save();

  const token = savedUser.generateAuthToken();
  const { password, ...userWithoutPassword } = savedUser.toObject();
  res.status(201).json({ user: userWithoutPassword, token });
};

exports.login = async (req, res) => {
  const { error, value } = userLoginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const user = await User.findOne({ email: value.email });
  if (!user)
    return res.status(401).json({ error: "Invalid email or password" });

  const isPasswordValid = await user.comparePassword(value.password);
  if (!isPasswordValid)
    return res.status(401).json({ error: "Invalid email or password" });

  const token = user.generateAuthToken();
  const { password, ...userWithoutPassword } = user.toObject();
  res
    .status(200)
    .json({ message: "Login successful", user: userWithoutPassword, token });
};
