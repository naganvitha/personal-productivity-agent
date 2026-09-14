const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/schedule', require('./routes/scheduleRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Personal Productivity Agent API is running.',
    version: '1.0.0',
    status: 'ONLINE',
    agentEngine: 'ACTIVE'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 Personal Productivity Agent Backend Running`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🤖 AI Decision Engine: ACTIVE`);
  console.log(`=================================================`);
});
