const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const User = require("../models/User");

// Profile route
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected data",
    user: req.user,
  });
});

// Get all users except current user
router.get("/", protect, async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user.id },
    }).select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
});

module.exports = router;
