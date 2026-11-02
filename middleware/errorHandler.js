const errorHandler = (error, _request, response, _next) => {
  if (response.headersSent) return;
  if (error.code === 11000) {
    return response.status(409).json({ error: "An account with that email already exists." });
  }
  if (error.name === "ValidationError" || error.name === "CastError") {
    return response.status(400).json({ error: error.message });
  }

  console.error(error);
  return response.status(500).json({ error: "Something went wrong. Please try again." });
}

module.exports = errorHandler;