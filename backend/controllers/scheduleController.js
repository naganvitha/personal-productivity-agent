const Schedule = require('../models/Schedule');
const Task = require('../models/Task');
const User = require('../models/User');
const ProductivityAgentEngine = require('../ai/agentEngine');

const getTodayDateString = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

// Get today's schedule
exports.getTodaySchedule = async (req, res) => {
  try {
    const todayStr = getTodayDateString();
    let schedule = await Schedule.findOne({ userId: req.userId, date: todayStr });

    if (!schedule) {
      // Auto-generate initial schedule
      const user = await User.findById(req.userId);
      const tasks = await Task.find({ userId: req.userId });
      
      const generated = ProductivityAgentEngine.planDailySchedule(tasks, {
        workStart: user?.workStart || '09:00',
        workEnd: user?.workEnd || '17:00',
        preferredBreakMinutes: user?.preferredBreakMinutes || 15
      });

      schedule = await Schedule.create({
        userId: req.userId,
        date: todayStr,
        availableHours: generated.availableHours,
        workStart: generated.workStart,
        workEnd: generated.workEnd,
        scheduledTasks: generated.scheduledTasks,
        aiNotes: generated.aiNotes
      });
    }

    res.json({ success: true, schedule });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Re-generate Daily Schedule with AI Smart Scheduler Engine
exports.generateSchedule = async (req, res) => {
  try {
    const { workStart, workEnd, preferredBreakMinutes } = req.body;
    const todayStr = getTodayDateString();

    const user = await User.findById(req.userId);
    const tasks = await Task.find({ userId: req.userId });

    const options = {
      workStart: workStart || user?.workStart || '09:00',
      workEnd: workEnd || user?.workEnd || '17:00',
      preferredBreakMinutes: preferredBreakMinutes || user?.preferredBreakMinutes || 15
    };

    const generated = ProductivityAgentEngine.planDailySchedule(tasks, options);

    // Save or update schedule doc for today
    let schedule = await Schedule.findOne({ userId: req.userId, date: todayStr });

    if (schedule) {
      schedule.availableHours = generated.availableHours;
      schedule.workStart = generated.workStart;
      schedule.workEnd = generated.workEnd;
      schedule.scheduledTasks = generated.scheduledTasks;
      schedule.aiNotes = generated.aiNotes;
      await schedule.save();
    } else {
      schedule = await Schedule.create({
        userId: req.userId,
        date: todayStr,
        availableHours: generated.availableHours,
        workStart: generated.workStart,
        workEnd: generated.workEnd,
        scheduledTasks: generated.scheduledTasks,
        aiNotes: generated.aiNotes
      });
    }

    res.json({ success: true, schedule });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
