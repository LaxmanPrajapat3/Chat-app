const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const Message = require('./models/message');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

mongoose.connect('mongodb://127.0.0.1:27017/mern-chat', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'));

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// File upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });
app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({ filePath: req.file.path });
});

// Socket.io
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('sendMessage', async ({ from, to, message, file }) => {
    const newMessage = await Message.create({ from, to, message, file });
    io.to(to).emit('receiveMessage', newMessage);
  });

  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('disconnect', () => console.log('User disconnected'));
});

server.listen(5000, () => console.log('Server running on 5000'));
