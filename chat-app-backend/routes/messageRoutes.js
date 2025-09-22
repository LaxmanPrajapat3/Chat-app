const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// Get messages between two users
router.get("/", async (req, res) => {
  const { from, to } = req.query;
  try {
    const messages = await Message.find({
      $or: [
        { from, to },
        { from: to, to: from }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Send a message
router.post("/", async (req, res) => {
  const { from, to, message } = req.body;
  try {
    const newMessage = new Message({ from, to, message });
    await newMessage.save();
    res.json(newMessage);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
