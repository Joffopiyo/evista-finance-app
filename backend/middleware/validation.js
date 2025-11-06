const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array(),
      code: 400 
    });
  }
  next();
};

const signupValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  handleValidationErrors
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
  handleValidationErrors
];

const transactionValidation = [
  body('description').notEmpty().trim().isLength({ max: 100 }),
  body('amount').isFloat({ min: 0 }),
  body('type').isIn(['income', 'expense']),
  handleValidationErrors
];

const roleValidation = [
  body('role').isIn(['user', 'admin']),
  handleValidationErrors
];

module.exports = {
  signupValidation,
  loginValidation,
  transactionValidation,
  roleValidation
};