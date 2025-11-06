const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Course', courseSchema);