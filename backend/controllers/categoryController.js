const Category = require('../models/Category');

const defaultCategories = ['Academic', 'Personal', 'Work', 'Health', 'Other'];

// Get user categories
exports.getCategories = async (req, res) => {
  try {
    let categories = await Category.find({ userId: req.userId });

    // Seed default categories if user has none
    if (categories.length === 0) {
      const catDocs = defaultCategories.map(cat => ({
        userId: req.userId,
        categoryName: cat,
        isDefault: true
      }));
      categories = await Category.insertMany(catDocs);
    }

    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Add custom category
exports.createCategory = async (req, res) => {
  try {
    const { categoryName, color } = req.body;

    if (!categoryName) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const existing = await Category.findOne({ userId: req.userId, categoryName });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category already exists.' });
    }

    const category = await Category.create({
      userId: req.userId,
      categoryName,
      color: color || '#8b5cf6',
      isDefault: false
    });

    res.status(201).json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete custom category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, userId: req.userId });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    if (category.isDefault) {
      return res.status(400).json({ success: false, message: 'Cannot delete default categories.' });
    }
    await category.deleteOne();
    res.json({ success: true, message: 'Category deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
