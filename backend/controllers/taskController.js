const Task = require('../models/Task');
const ProductivityAgentEngine = require('../ai/agentEngine');
const { analyzeTaskPriority } = require('../ai/priorityAnalyzer');

// Get all user tasks
exports.getTasks = async (req, res) => {
  try {
    const rawTasks = await Task.find({ userId: req.userId }).sort({ deadline: 1 });
    // Run real-time AI Agent analysis on all tasks to update scores
    const analyzedTasks = ProductivityAgentEngine.analyzeTasks(rawTasks);
    res.json({ success: true, count: analyzedTasks.length, tasks: analyzedTasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create new task with instant AI Priority Generation
exports.createTask = async (req, res) => {
  try {
    const { title, description, category, deadline, estimatedDuration, priority } = req.body;

    if (!title || !deadline) {
      return res.status(400).json({ success: false, message: 'Title and deadline are required.' });
    }

    // Run AI Agent priority analysis
    const aiAnalysis = analyzeTaskPriority({
      title,
      description,
      category,
      deadline,
      estimatedDuration: estimatedDuration || 60,
      priority: priority || 'Medium'
    });

    const task = await Task.create({
      userId: req.userId,
      title,
      description: description || '',
      category: category || 'Work',
      deadline: new Date(deadline),
      estimatedDuration: Number(estimatedDuration) || 60,
      priority: priority || 'Medium',
      status: 'Pending',
      aiRecommendedPriority: aiAnalysis.aiRecommendedPriority,
      aiReason: aiAnalysis.aiReason,
      urgencyScore: aiAnalysis.urgencyScore
    });

    res.status(201).json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const { title, description, category, deadline, estimatedDuration, priority, status } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (category) task.category = category;
    if (deadline) task.deadline = new Date(deadline);
    if (estimatedDuration) task.estimatedDuration = Number(estimatedDuration);
    if (priority) task.priority = priority;
    if (status) {
      task.status = status;
      if (status === 'Completed') {
        task.completedAt = new Date();
      }
    }

    // Re-run AI Priority analysis
    const aiAnalysis = analyzeTaskPriority(task);
    task.aiRecommendedPriority = aiAnalysis.aiRecommendedPriority;
    task.aiReason = aiAnalysis.aiReason;
    task.urgencyScore = aiAnalysis.urgencyScore;

    await task.save();

    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }
    res.json({ success: true, message: 'Task deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Toggle status completion
exports.toggleComplete = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    task.status = task.status === 'Completed' ? 'Pending' : 'Completed';
    task.completedAt = task.status === 'Completed' ? new Date() : null;

    await task.save();

    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Analyze temporary task preview
exports.analyzeTaskPreview = async (req, res) => {
  try {
    const { title, description, category, deadline, estimatedDuration, priority } = req.body;
    const aiAnalysis = analyzeTaskPriority({
      title,
      description,
      category,
      deadline,
      estimatedDuration: estimatedDuration || 60,
      priority: priority || 'Medium'
    });
    res.json({ success: true, analysis: aiAnalysis });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
