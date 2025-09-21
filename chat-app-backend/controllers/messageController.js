const Message = require('../models/message');

exports.getMessages = async (req, res) => {
  const { from, to } = req.query;
  const messages = await Message.find({
    $or: [
      { from, to },
      { from: to, to: from }
    ]
  }).sort({ createdAt: 1 });
  res.json(messages);
};
