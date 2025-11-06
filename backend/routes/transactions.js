const express = require('express');
const Transaction = require('../models/Transaction');
const { authMiddleware } = require('../middleware/auth');
const { transactionValidation } = require('../middleware/validation');

const router = express.Router();

// Get all transactions for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { userId: req.user._id };
    
    if (type && ['income', 'expense'].includes(type)) {
      filter.type = type;
    }

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .select('-userId');

    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Internal server error', code: 500 });
  }
});

// Create transaction
router.post('/', authMiddleware, transactionValidation, async (req, res) => {
  try {
    const { description, amount, type, category = 'general' } = req.body;

    const transaction = new Transaction({
      userId: req.user._id,
      description,
      amount,
      type,
      category
    });

    await transaction.save();

    const transactionResponse = transaction.toObject();
    delete transactionResponse.userId;

    res.status(201).json(transactionResponse);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Internal server error', code: 500 });
  }
});

// Delete transaction
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found', code: 404 });
    }

    await Transaction.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Internal server error', code: 500 });
  }
});

module.exports = router;