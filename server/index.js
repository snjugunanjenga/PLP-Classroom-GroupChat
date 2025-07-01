require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const groupRoutes = require('./routes/groups');
const messageRoutes = require('./routes/messages');
const { verifyToken } = require('./utils/jwt');
const Group = require('./models/Group');
const Message = require('./models/Message');
const User = require('./models/User');
const morgan = require('morgan');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend port (e.g., Vite default)
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/classroom-chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware for Socket.io authentication
const userSockets = {};
const onlineUsers = new Set();
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));
  try {
    const decoded = verifyToken(token);
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.username}`);
  userSockets[socket.user.id] = socket.id;
  onlineUsers.add(socket.user.id);
  io.emit('user-online', socket.user.id);

  socket.on('disconnect', () => {
    onlineUsers.delete(socket.user.id);
    delete userSockets[socket.user.id];
    io.emit('user-offline', socket.user.id);
  });

  // Join/leave groups
  socket.on('join group', async (groupId) => {
    try {
      const group = await Group.findById(groupId);
      if (!group) return socket.emit('error', 'Group not found');
      if (!group.members.includes(socket.user.id)) return socket.emit('error', 'Not a member');
      socket.join(groupId);
      socket.emit('joined group', groupId);
    } catch (error) {
      socket.emit('error', 'Server error');
    }
  });

  socket.on('leave group', (groupId) => {
    socket.leave(groupId);
    socket.emit('left group', groupId);
  });

  // Group messages
  socket.on('send group message', async ({ groupId, content }) => {
    try {
      const group = await Group.findById(groupId);
      if (!group || !group.members.includes(socket.user.id)) return socket.emit('error', 'Invalid group');
      const unreadBy = group.members.filter(id => id.toString() !== socket.user.id);
      const message = new Message({ sender: socket.user.id, group: groupId, content, unreadBy });
      await message.save();
      io.to(groupId).emit('new group message', message);
    } catch (error) {
      socket.emit('error', 'Server error');
    }
  });

  // Private messages
  socket.on('send private message', async ({ recipientId, content }) => {
    try {
      const message = new Message({ sender: socket.user.id, recipient: recipientId, content });
      await message.save();
      const recipientSocketId = userSockets[recipientId];
      if (recipientSocketId) io.to(recipientSocketId).emit('new private message', message);
      socket.emit('new private message', message);
    } catch (error) {
      socket.emit('error', 'Server error');
    }
  });

  // Typing indicators
  socket.on('typing in group', ({ groupId }) => {
    socket.to(groupId).emit('user typing in group', { groupId, user: socket.user.username });
  });

  socket.on('stop typing in group', ({ groupId }) => {
    socket.to(groupId).emit('user stop typing in group', { groupId, user: socket.user.username });
  });

  socket.on('typing in private', ({ recipientId }) => {
    const recipientSocketId = userSockets[recipientId];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('user typing in private', { sender: socket.user.username });
    }
  });

  socket.on('stop typing in private', ({ recipientId }) => {
    const recipientSocketId = userSockets[recipientId];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('user stop typing in private', { sender: socket.user.username });
    }
  });

  // Message reactions
  socket.on('react to message', async ({ messageId, reaction }) => {
    try {
      const message = await Message.findById(messageId);
      if (!message) return socket.emit('error', 'Message not found');
      message.reactions.push({ user: socket.user.id, reaction });
      await message.save();
      if (message.group) {
        io.to(message.group.toString()).emit('message reaction', {
          messageId,
          reaction,
          user: socket.user.username
        });
      } else if (message.recipient) {
        const recipientSocketId = userSockets[message.recipient.toString()];
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('message reaction', { messageId, reaction, user: socket.user.username });
        }
        socket.emit('message reaction', { messageId, reaction, user: socket.user.username });
      }
    } catch (error) {
      socket.emit('error', 'Server error');
    }
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/messages', messageRoutes);

// Endpoint to get all currently online users
app.get('/api/users/online', (req, res) => {
  res.json(Array.from(onlineUsers));
});

// Endpoint to get all users (for private messaging)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, '_id username');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;