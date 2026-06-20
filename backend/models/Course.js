const mongoose = require('mongoose');

// 1. LESSON SCHEMA
const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['video', 'quiz', 'notes'], required: true },
  videoUrl: { type: String },     
  contentUrl: { type: String },   
  duration: { type: String },     
  isLocked: { type: Boolean, default: false },
  
  // 🚨 THE FIX (GOD-MODE): Mixed type laga diya. 
  // Ab Mongoose kabhi bhi quiz ke data ko delete ya reject nahi karega!
  quizData: { type: mongoose.Schema.Types.Mixed }
});

// 2. MODULE SCHEMA
const moduleSchema = new mongoose.Schema({
  moduleTitle: { type: String, required: true },
  lessons: [lessonSchema] 
});

// 3. MAIN COURSE SCHEMA
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  videoUrl: { type: String, required: false }, 
  createdAt: { type: Date, default: Date.now },
  notesUrl: { type: String },
  status: { type: String, enum: ['Draft', 'Published', 'Scheduled'], default: 'Published' },
  releaseType: { type: String, enum: ['instant', 'drip'], default: 'instant' },
  useAIQuiz: { type: Boolean, default: false },
  studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  revenue: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  curriculum: [moduleSchema], 
  qaList: [{ 
    user: String, 
    text: String, 
    isInstructor: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now } 
  }]
});

module.exports = mongoose.model('Course', courseSchema);