const Task = require('../models/Task');
const Schedule = require('../models/Schedule');
const ProductivityAgentEngine = require('../ai/agentEngine');

// Handle Chatbot Query
exports.handleChat = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Message query is required.' });
    }

    const tasks = await Task.find({ userId: req.userId });
    const todayStr = new Date().toISOString().split('T')[0];
    const schedule = await Schedule.findOne({ userId: req.userId, date: todayStr });

    const response = await ProductivityAgentEngine.interact(query, tasks, schedule);
    res.json({ success: true, ...response });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Productivity Insights & Agent Architecture Status
exports.getInsights = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    const todayStr = new Date().toISOString().split('T')[0];
    const schedule = await Schedule.findOne({ userId: req.userId, date: todayStr });

    const insights = ProductivityAgentEngine.generateInsights(tasks, schedule);
    res.json({ success: true, insights });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Recalculate AI Agent Plan
exports.recalculateAgentPlan = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    // Re-run AI analysis on all tasks
    for (const task of tasks) {
      const analysis = ProductivityAgentEngine.analyzeTasks([task])[0];
      task.aiRecommendedPriority = analysis.aiRecommendedPriority;
      task.aiReason = analysis.aiReason;
      task.urgencyScore = analysis.urgencyScore;
      await task.save();
    }

    res.json({ success: true, message: 'AI Agent recalculation complete. Priorities updated across all tasks.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
