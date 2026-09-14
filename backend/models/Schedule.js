const mongoose = require('mongoose');

const scheduledTaskItemSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  taskTitle: String,
  category: String,
  startTime: String, // e.g. "09:00 AM"
  endTime: String,   // e.g. "10:30 AM"
  durationMinutes: Number,
  isBreak: {
    type: Boolean,
    default: false
  },
  breakLabel: String,
  priority: String,
  status: String
});

const scheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  availableHours: {
    type: Number,
    default: 8
  },
  workStart: {
    type: String,
    default: '09:00'
  },
  workEnd: {
    type: String,
    default: '17:00'
  },
  scheduledTasks: [scheduledTaskItemSchema],
  aiNotes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Schedule', scheduleSchema);
