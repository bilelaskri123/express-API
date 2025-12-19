const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const logger = require("./middlewares/logger");
const { notFoundHandler, errorHandler } = require("./middlewares/errors");
const connectDB = require("./config/db");

// Middleware to parse JSON bodies
app.use(express.json());

// Database connection
connectDB();

// Logger middleware
app.use(logger);

// Use routes (centralized)
app.use("/", require("./routes"));

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
