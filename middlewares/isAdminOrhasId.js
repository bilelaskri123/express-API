const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

module.exports = async function (req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    const user = await User.findById(decoded.id);
    if (user?.role == "admin") {
      next();
      return;
    }

    if (decoded.id == req.params.id) {
      next();
      return;
    }

    return res.status(403).json({ error: "Access denied." });
  } catch (err) {
    res.status(400).json({ error: "Invalid token." });
  }
};
