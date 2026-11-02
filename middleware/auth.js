const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { verifyToken } = require("../utils/token");

const authenticate = asyncHandler(async (request, response, next) => {
  const authorization = request.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!token) return response.status(401).json({ error: "Please sign in to continue." });

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return response.status(401).json({ error: "Your session is invalid or has expired." });
  }

  const user = await User.findById(payload.sub);
  if (!user) return response.status(401).json({ error: "Your session is no longer valid." });
  request.user = user;
  return next();
});

function requireAdmin(request, response, next) {
  if (request.user?.role !== "admin") {
    return response.status(403).json({ error: "Admin access is required." });
  }
  return next();
}

module.exports = { 
  authenticate,
  requireAdmin
}
