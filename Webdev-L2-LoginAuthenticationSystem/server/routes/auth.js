const express = require("express");

const { registerUser, loginUser, getMe } = require("../controllers/authController");
const protect = require("../middleware/protect");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ message: "auth API up" });
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

module.exports = router;
