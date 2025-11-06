const express = require('express');
const Course = require('../models/Course');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true });
    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Internal server error', code: 500 });
  }
});

module.exports = router;