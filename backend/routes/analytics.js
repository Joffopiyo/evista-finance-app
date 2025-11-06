const express = require('express');
const Transaction = require('../models/Transaction');
const Course = require('../models/Course');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get analytics summary
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const transactions = await Transaction.find({ userId });
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const savings = totalIncome - totalExpense;

    const courses = await Course.find({ isActive: true });
    const coursesProgress = courses.map(course => ({
      title: course.title,
      progress: Math.floor(Math.random() * 100),
      duration: course.duration
    }));

    res.json({
      totalIncome,
      totalExpense,
      savings,
      transactionsCount: transactions.length,
      coursesProgress
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Internal server error', code: 500 });
  }
});

module.exports = router;