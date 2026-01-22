// ✅ dotenv MUST be first
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';

// Routes
import authRoutes from './routes/auth.js';
import settingsRoutes from './routes/settings.js';
import postsRoutes from './routes/posts.js';
import teamRoutes from './routes/team.js';
import contactRoutes from './routes/contact.js';

const app = express();
const httpServer = createServer(app);

/**
 * ✅ Allowed Frontend Origins
 * Add ALL domains that may access your backend
 */
const allowedOrigins = [
  'https://talkcanvas.com',
  'https://www.talkcanvas.com',
  'https://talkcanva.vercel.app',
  'http://localhost:5173'
];

// ✅ CORS configuration (Express + Socket.IO)
const corsOptions = {
  origin: (origin, callback) => {
    // allow server-to-server / Postman / health checks
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// ✅ Socket.IO with same CORS rules
const io = new Server(httpServer, {
  cors: corsOptions,
});

// Make socket available globally
global.io = io;

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Connect to MongoDB
await connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});





// original backend code that get fronturl cors from env file
// // ✅ dotenv MUST be first
// import dotenv from 'dotenv';
// dotenv.config();

// import express from 'express';
// import cors from 'cors';
// import { createServer } from 'http';
// import { Server } from 'socket.io';
// import { connectDB } from './config/db.js';

// // Routes
// import authRoutes from './routes/auth.js';
// import settingsRoutes from './routes/settings.js';
// import postsRoutes from './routes/posts.js';
// import teamRoutes from './routes/team.js';
// import contactRoutes from './routes/contact.js';

// const app = express();
// const httpServer = createServer(app);

// // CORS configuration
// const corsOptions = {
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };

// // Socket.IO
// const io = new Server(httpServer, {
//   cors: corsOptions,
// });

// // Make socket available globally
// global.io = io;

// // Middleware
// app.use(cors(corsOptions));
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// // Connect to MongoDB
// await connectDB();

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/settings', settingsRoutes);
// app.use('/api/posts', postsRoutes);
// app.use('/api/team', teamRoutes);
// app.use('/api/contact', contactRoutes);

// // Health check
// app.get('/api/health', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Server is running',
//   });
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route not found',
//   });
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error('Server Error:', err);
//   res.status(500).json({
//     success: false,
//     message: err.message || 'Internal Server Error',
//   });
// });

// // Socket.IO connection
// io.on('connection', (socket) => {
//   console.log('Client connected:', socket.id);

//   socket.on('disconnect', () => {
//     console.log('Client disconnected:', socket.id);
//   });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// httpServer.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
