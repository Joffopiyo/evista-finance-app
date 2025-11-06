const express = require('express');
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { roleValidation } = require('../middleware/validation');

const router = express.Router();

// Get all users
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error', code: 500 });
  }
});

// Update user role
router.put('/users/:id/role', authMiddleware, adminMiddleware, roleValidation, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ error: 'User not found', code: 404 });
    }

    res.json(user);
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Internal server error', code: 500 });
  }
});

module.exports = router;