const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const protect = require("../middleware/authMiddleware");

router.get("/:receiverId", protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.receiverId },
        { sender: req.params.receiverId, receiver: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
