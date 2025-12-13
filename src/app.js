const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const tagRoutes = require('./routes/tagRoutes');

// 1. Konfigurasi Environment
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 2. Middleware Wajib & Security
app.use(morgan('dev')); // Logger Middleware 
app.use(helmet());      // Security Headers [cite: 204]
app.use(cors());        // Handling CORS
app.use(express.json()); // Parsing JSON Body
app.use(express.urlencoded({ extended: true }));

// 3. Routing Dasar (Health Check)
// Wajib ada untuk deployment nanti [cite: 390]
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend Task Management API is Running!',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/tags', tagRoutes);

// 4. Error Handling Middleware (Placeholder)
// Lengkapi nanti sesuai spesifikasi [cite: 186]
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

// 5. Start Server
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV}`);
});