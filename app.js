const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const logger = require("./middlewares/logger");
const { notFoundHandler, errorHandler } = require("./middlewares/errors");
const connectDB = require("./config/db");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

// Middleware to parse JSON bodies
app.use(express.json());

// Database connection is performed when the server is started (so app can be imported in tests)

// Logger middleware
app.use(logger);
// Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Use routes (centralized)
app.use("/", require("./routes"));

// not found middleware
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

// Start the server when run directly and connect to DB there (keeps app importable for tests)
if (require.main === module) {
  // connect to DB (when running server directly)
  connectDB();

  app.listen(PORT, () => {
    console.log(
      `Server is running in ${NODE_ENV} mode on http://localhost:${PORT}`
    );
  });
}

module.exports = app;
