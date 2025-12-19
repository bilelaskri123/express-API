const notFoundHandler = (req, res, next) => {
  res.status(404).json({ error: "Resource not found" });
};

const errorHandler = (err, req, res, next) => {
  console.error("error middleware: ", err.stack);
  res.status(500).json({ error: err.message });
};

module.exports = { notFoundHandler, errorHandler };
