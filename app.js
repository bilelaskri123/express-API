const express = require("express");
const swaggerUi = require("swagger-ui-express");
const helmet = require("helmet");
const cors = require("cors");

const logger = require("./middlewares/logger");
const { notFoundHandler, errorHandler } = require("./middlewares/errors");
const connectDB = require("./config/db");
const swaggerSpec = require("./docs/swagger");

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
// Security middleware
app.use(helmet());
// Enable CORS
app.use(cors());

// Logger middleware
app.use(logger);
// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
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

  const PORT = process.env.PORT || 3000;
  const NODE_ENV = process.env.NODE_ENV || "development";
  app.listen(PORT, () => {
    console.log(
      `Server is running in ${NODE_ENV} mode on http://localhost:${PORT}`
    );
  });
}

module.exports = app;
