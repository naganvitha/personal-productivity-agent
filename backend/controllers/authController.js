const User = require('../models/User');
const Category = require('../models/Category');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_personal_productivity_agent_2026';

const defaultCategories = ['Academic', 'Personal', 'Work', 'Health', 'Other'];

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password, workStart, workEnd } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      workStart: workStart || '09:00',
      workEnd: workEnd || '17:00'
    });

    // Seed default categories for user
    const catDocs = defaultCategories.map(cat => ({
      userId: user._id,
      categoryName: cat,
      isDefault: true
    }));
    await Category.insertMany(catDocs);

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        workStart: user.workStart,
        workEnd: user.workEnd
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        workStart: user.workStart,
        workEnd: user.workEnd
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get current user profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update user settings
exports.updateProfile = async (req, res) => {
  try {
    const { name, workStart, workEnd, preferredBreakMinutes } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (name) user.name = name;
    if (workStart) user.workStart = workStart;
    if (workEnd) user.workEnd = workEnd;
    if (preferredBreakMinutes) user.preferredBreakMinutes = preferredBreakMinutes;

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        workStart: user.workStart,
        workEnd: user.workEnd,
        preferredBreakMinutes: user.preferredBreakMinutes
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
