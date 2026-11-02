const bcrypt = require("bcryptjs");
const User = require("../models/User");
const asyncHandler =require("../utils/asyncHandler");
const { signToken } = require("../utils/token");

const signup = asyncHandler(async (request, response) => {
  const { name, email, password } = request.body || {};
  if (typeof name !== "string" || name.trim().length < 2
    || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    || typeof password !== "string" || password.length < 8) {
    return response.status(400).json({ error: "Enter a name, valid email, and password with at least 8 characters." });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (await User.exists({ email: normalizedEmail })) {
    return response.status(409).json({ error: "An account with that email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash });
  return response.status(201).json({ token: signToken(user), user });
});

const login = asyncHandler(async (request, response) => {
  const { email, password } = request.body || {};
  if (typeof email !== "string" || typeof password !== "string") {
    return response.status(400).json({ error: "Email and password are required." });
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+passwordHash");
  if (!user || !(await user.comparePassword(password))) {
    return response.status(401).json({ error: "That email and password combination wasn't recognized." });
  }
  return response.json({ token: signToken(user), user });
});

const currentUser = (request, response) => response.json({ user: request.user });

module.exports = {
  signup,
  login,
  currentUser
}