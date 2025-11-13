// middleware/errorHandler.js
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "SequelizeValidationError") {
    return response.status(400).json({ error: "Validation error" });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({ error: "Duplicate value error" });
  }

  if (error.name === "CastError") {
    return response.status(400).json({ error: "Malformed ID" });
  }

  // Default fallback
  response.status(500).json({ error: "Internal server error" });
};

module.exports = errorHandler;
