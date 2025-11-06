const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Course = require('../models/Course');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/evista');

    console.log('Seeding database...');

    // Clear existing data
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await Course.deleteMany({});

    // Create admin user
    const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
    const adminUser = new User({
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      role: 'admin'
    });
    await adminUser.save();
    console.log('Admin user created: admin@example.com / Admin@123');

    // Create sample user
    const userPasswordHash = await bcrypt.hash('User@123', 10);
    const sampleUser = new User({
      email: 'user@example.com',
      passwordHash: userPasswordHash,
      role: 'user'
    });
    await sampleUser.save();
    console.log('Sample user created: user@example.com / User@123');

    // Create sample transactions
    const sampleTransactions = [
      { description: 'Salary', amount: 3000, type: 'income', category: 'salary' },
      { description: 'Freelance Work', amount: 500, type: 'income', category: 'freelance' },
      { description: 'Rent', amount: 1200, type: 'expense', category: 'housing' },
      { description: 'Groceries', amount: 300, type: 'expense', category: 'food' },
      { description: 'Utilities', amount: 150, type: 'expense', category: 'utilities' },
      { description: 'Entertainment', amount: 100, type: 'expense', category: 'entertainment' }
    ];

    for (const trans of sampleTransactions) {
      const transaction = new Transaction({
        userId: sampleUser._id,
        ...trans
      });
      await transaction.save();
    }
    console.log('Sample transactions created');

    // Create sample courses
    const sampleCourses = [
      {
        title: 'Budgeting Basics',
        description: 'Learn how to create and maintain a personal budget',
        duration: '2 weeks',
        imageUrl: '/images/budgeting.jpg'
      },
      {
        title: 'Investment Fundamentals',
        description: 'Understand the basics of investing and portfolio management',
        duration: '4 weeks',
        imageUrl: '/images/investment.jpg'
      },
      {
        title: 'Debt Management',
        description: 'Strategies for managing and reducing personal debt',
        duration: '3 weeks',
        imageUrl: '/images/debt.jpg'
      },
      {
        title: 'Retirement Planning',
        description: 'Plan for a secure financial future',
        duration: '3 weeks',
        imageUrl: '/images/retirement.jpg'
      }
    ];

    for (const course of sampleCourses) {
      const newCourse = new Course(course);
      await newCourse.save();
    }
    console.log('Sample courses created');

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();