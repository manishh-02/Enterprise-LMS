const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  title: String,
  questions: [{
    questionText: String,
    options: [String],
    correctAnswer: String
  }],
  duration: Number, // in minutes
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Assessment', assessmentSchema);