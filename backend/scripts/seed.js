const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Task = require('../models/Task');
const Category = require('../models/Category');
const { analyzeTaskPriority } = require('../ai/priorityAnalyzer');
const connectDB = require('../config/db');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('Seeding initial demo data...');
    
    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    await Category.deleteMany({});

    // Create demo user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const user = await User.create({
      name: 'Alex Johnson',
      email: 'demo@productivity.ai',
      password: hashedPassword,
      workStart: '09:00',
      workEnd: '17:00',
      preferredBreakMinutes: 15
    });

    console.log(`Demo User Created: ${user.email} (Password: password123)`);

    // Create categories
    const categories = ['Academic', 'Personal', 'Work', 'Health', 'Other'];
    await Category.insertMany(categories.map(c => ({ userId: user._id, categoryName: c, isDefault: true })));

    // Create tasks
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 18 * 60 * 60 * 1000);
    const inTwoDays = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const inThreeDays = new Date(now.getTime() + 72 * 60 * 60 * 1000);
    const inFiveDays = new Date(now.getTime() + 120 * 60 * 60 * 1000);

    const rawTasks = [
      {
        title: 'Complete DBMS Project Presentation',
        description: 'Prepare slides for ER diagram, normalization, and relational schema for tomorrow\'s review.',
        category: 'Academic',
        deadline: tomorrow,
        estimatedDuration: 120,
        priority: 'High',
        status: 'Pending'
      },
      {
        title: 'Submit Expense Reimbursement Form',
        description: 'Upload receipts for recent conference travel and team dinner.',
        category: 'Work',
        deadline: new Date(now.getTime() + 6 * 60 * 60 * 1000), // due today in 6h
        estimatedDuration: 30,
        priority: 'High',
        status: 'Pending'
      },
      {
        title: 'Prepare Machine Learning Assignment',
        description: 'Implement K-Means clustering algorithm and generate accuracy comparison charts in Python.',
        category: 'Academic',
        deadline: inTwoDays,
        estimatedDuration: 180,
        priority: 'High',
        status: 'In Progress'
      },
      {
        title: 'Weekly Fitness Workout Routine',
        description: '30-min cardio followed by core strength exercises.',
        category: 'Health',
        deadline: inThreeDays,
        estimatedDuration: 45,
        priority: 'Medium',
        status: 'Pending'
      },
      {
        title: 'Read System Design Architecture Chapter 4',
        description: 'Focus on distributed caching strategies and database sharding trade-offs.',
        category: 'Personal',
        deadline: inFiveDays,
        estimatedDuration: 60,
        priority: 'Low',
        status: 'Pending'
      }
    ];

    for (const item of rawTasks) {
      const aiAnalysis = analyzeTaskPriority(item);
      await Task.create({
        userId: user._id,
        ...item,
        aiRecommendedPriority: aiAnalysis.aiRecommendedPriority,
        aiReason: aiAnalysis.aiReason,
        urgencyScore: aiAnalysis.urgencyScore
      });
    }

    console.log('Successfully seeded 5 initial tasks with AI Agent priority analysis!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
