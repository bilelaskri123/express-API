const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const NODE_ENV = process.env.NODE_ENV || "development";
const logger = require("./middlewares/logger");
const { notFoundHandler, errorHandler } = require("./middlewares/errors");

// Middleware to parse JSON bodies
app.use(express.json());

// Database connection
const mongoose = require("mongoose");
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB", err);
  });

// Logger middleware
app.use(logger);

// Import routes
const authorRoutes = require("./routes/author");
const bookRoutes = require("./routes/book");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

// Use routes
app.use("/auth", authRoutes);
app.use("/authors", authorRoutes);
app.use("/books", bookRoutes);
app.use("/users", userRoutes);

// not found middleware
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(
    `Server is running in ${NODE_ENV} mode on http://localhost:${PORT}`
  );
});
