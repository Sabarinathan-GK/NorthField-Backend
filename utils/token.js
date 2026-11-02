const jwt = require('jsonwebtoken');

const signToken = (user) => {
  return jwt.sign(
    { role: user.role },
    process.env.JWT_SECRET || "development-only-change-me-before-deploying",
    { subject: user.id, expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );
}

const verifyToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET || "development-only-change-me-before-deploying",
  );
}

module.exports = {
  signToken,
  verifyToken
}