const jwt = require("jsonwebtoken");

const User = require("../models/User");

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

function isValidPassword(password) {
  return typeof password === "string" && password.length >= 8 && /\d/.test(password);
}

function toPublicUser(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  };
}

async function registerUser(req, res, next) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 characters." });
    }

    if (!isValidPassword(password)) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters and include a number." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: username.trim() }],
    });

    if (existing) {
      return res.status(409).json({ message: "Username or email already in use." });
    }

    const user = await User.create({
      username: username.trim(),
      email: normalizedEmail,
      password,
    });

    return res.status(201).json({
      token: generateToken(user._id),
      user: toPublicUser(user),
    });
  } catch (err) {
    console.error(`[auth/register] ${err.message}`);
    return next(err);
  }
}

async function loginUser(req, res, next) {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const value = identifier.toLowerCase().trim();

    const user = await User.findOne({
      $or: [{ email: value }, { username: identifier.trim() }],
    });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials. Please try again." });
    }

    return res.status(200).json({
      token: generateToken(user._id),
      user: toPublicUser(user),
    });
  } catch (err) {
    console.error(`[auth/login] ${err.message}`);
    return next(err);
  }
}

async function getMe(req, res, next) {
  try {
    return res.status(200).json(toPublicUser(req.user));
  } catch (err) {
    console.error(`[auth/me] ${err.message}`);
    return next(err);
  }
}

module.exports = { registerUser, loginUser, getMe };
