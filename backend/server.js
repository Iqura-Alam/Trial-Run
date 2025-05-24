// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const http = require('http');
// const socketIo = require('socket.io');
// const multer = require('multer');
// const path = require('path');

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI;

// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: '*', // For development only, restrict in production
//     methods: ['GET', 'POST'],
//   },
// });

// // Middlewares
// app.use(cors());
// app.use(express.json());


// // Static folder for uploaded images
// app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// // Test route
// app.get('/', (req, res) => {
//   res.send('✅ Server is running!');
// });

// // Route imports
// const authRoutes = require('./routes/auth');
// const meetupRoutes = require('./routes/meetup');

// // API routes
// app.use('/api/auth', authRoutes);
// app.use('/api/meetup', meetupRoutes);

// // MongoDB connection and server start
// mongoose.connect(MONGO_URI)
//   .then(() => {
//     console.log('✅ Connected to MongoDB');
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error('❌ MongoDB connection error:', err.message);
//   });

//   const chatRoutes = require('./routes/chatRoutes');
// app.use('/api/chat', chatRoutes);

// // Multer setup for image uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'public/uploads/'),
//   filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
// });
// const upload = multer({ storage });

// // Upload endpoint
// app.post('/upload', upload.single('image'), (req, res) => {
//   if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
//   const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
//   res.json({ imageUrl });
// });

// // Socket.IO chat logic
// io.on('connection', (socket) => {
//   console.log('🟢 New client connected');

//   socket.on('joinRoom', ({ roomId }) => {
//     socket.join(roomId);
//     console.log(`👤 User joined room: ${roomId}`);
//   });

//   socket.on('chatMessage', ({ roomId, sender, message }) => {
//     console.log(`📨 Message in ${roomId} from ${sender}: ${message}`);
//     io.to(roomId).emit('chatMessage', { sender, message });
//   });

//   socket.on('chatImage', ({ roomId, sender, imageUrl }) => {
//     console.log(`🖼️ Image in ${roomId} from ${sender}: ${imageUrl}`);
//     io.to(roomId).emit('chatImage', { sender, imageUrl });
//   });

//   socket.on('disconnect', () => {
//     console.log('🔴 Client disconnected');
//   });
// });


// // Start server
// server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // Restrict in production
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Static folder for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Test route
app.get('/', (req, res) => {
  res.send('✅ Server is running!');
});

// Route imports
const authRoutes = require('./routes/auth');
const meetupRoutes = require('./routes/meetup');
// const listingRoutes = require('./routes/listingRoutes');
const chatRoutes = require('./routes/chatRoutes');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/meetup', meetupRoutes);
// app.use('/api/listings', listingRoutes);
app.use('/api/chat', chatRoutes);

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Upload endpoint
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// MongoDB connection and server start
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

// Socket.IO chat logic
io.on('connection', (socket) => {
  console.log('🟢 New client connected');

  socket.on('joinRoom', ({ roomId }) => {
    socket.join(roomId);
    console.log(`👤 User joined room: ${roomId}`);
  });

  socket.on('chatMessage', ({ roomId, sender, message }) => {
    console.log(`📨 Message in ${roomId} from ${sender}: ${message}`);
    io.to(roomId).emit('chatMessage', { sender, message });
  });

  socket.on('chatImage', ({ roomId, sender, imageUrl }) => {
    console.log(`🖼️ Image in ${roomId} from ${sender}: ${imageUrl}`);
    io.to(roomId).emit('chatImage', { sender, imageUrl });
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected');
  });
});
