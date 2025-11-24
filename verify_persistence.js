const mongoose = require('mongoose');
const User = require('./backend/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyPersistence = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to: ${mongoose.connection.host}/${mongoose.connection.name}`);

        const testEmail = 'persistence_test_' + Date.now() + '@example.com';
        const testPassword = 'password123';

        console.log(`Creating test user: ${testEmail}`);
        const passwordHash = await bcrypt.hash(testPassword, 10);
        const user = new User({ email: testEmail, passwordHash });
        await user.save();
        console.log('User saved successfully.');

        console.log('Verifying user exists...');
        const foundUser = await User.findOne({ email: testEmail });
        if (!foundUser) {
            throw new Error('User NOT found immediately after save!');
        }
        console.log('User found.');

        console.log('Testing password comparison...');
        const isMatch = await foundUser.comparePassword(testPassword);
        if (!isMatch) {
            throw new Error('Password mismatch!');
        }
        console.log('Password matches.');

        console.log('Testing token generation...');
        const token = jwt.sign(
            { id: foundUser._id, email: foundUser.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '24h' }
        );
        console.log('Token generated:', token ? 'Yes' : 'No');

        console.log('Persistence verification passed!');

        // Cleanup
        await User.deleteOne({ email: testEmail });
        console.log('Test user cleaned up.');

        process.exit(0);
    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    }
};

verifyPersistence();
