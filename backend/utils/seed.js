const mongoose = require('mongoose');
const Course = require('../models/Course');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name');

    console.log('Seeding database with courses only...');

    // Clear existing courses and create new ones
    await Course.deleteMany({});

    const sampleCourses = [
      {
        title: 'Budgeting Basics',
        description: 'Learn how to create and maintain a personal budget',
        duration: '2 weeks'
      },
      {
        title: 'Investment Fundamentals',
        description: 'Understand the basics of investing and portfolio management',
        duration: '4 weeks'
      },
      {
        title: 'Debt Management',
        description: 'Strategies for managing and reducing personal debt',
        duration: '3 weeks'
      },
      {
        title: 'Retirement Planning',
        description: 'Plan for a secure financial future',
        duration: '3 weeks'
      }
    ];

    for (const course of sampleCourses) {
      const newCourse = new Course(course);
      await newCourse.save();
    }
    console.log('Sample courses created');

    console.log('Database seeding completed - No default users created');
    console.log('Create your first admin account through the registration page');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();