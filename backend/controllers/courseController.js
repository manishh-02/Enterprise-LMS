const Course = require('../models/Course');

const createCourse = async (req, res) => {
  try {
    // 🚨 THE FIX: req.body se 'curriculum' bhi nikal rahe hain
    const { title, description, price, category, videoUrl, notesUrl, releaseType, useAIQuiz, status, curriculum } = req.body;
    
    if (!title || !description || price === undefined || !category) {
      return res.status(400).json({ message: 'Provide all required fields.' });
    }

    const newCourse = await Course.create({ 
      title, 
      description, 
      price, 
      category, 
      videoUrl, 
      notesUrl, 
      releaseType: releaseType || 'instant',
      useAIQuiz: useAIQuiz || false, 
      status: status || 'Published', 
      instructor: req.user.id,
      curriculum: curriculum || [] // <--- 🚨 Syllabus yahan save hoga
    });
    
    res.status(201).json({ success: true, message: 'Course created successfully!', course: newCourse });
  } catch (error) {
    console.error("Course creation error:", error);
    res.status(500).json({ message: 'Error creating course.' });
  }
};

const getCourses = async (req, res) => {
  try {
    let query = {};
    if (req.user && req.user.role && req.user.role.toLowerCase() !== 'admin') {
      query = { instructor: req.user.id };
    }

    const courses = await Course.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve courses.' });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve all courses.' });
  }
};

const updateCourse = async (req, res) => {
  try {
    let query = { _id: req.params.id };
    if (req.user && req.user.role && req.user.role.toLowerCase() !== 'admin') {
      query.instructor = req.user.id;
    }

    const course = await Course.findOneAndUpdate(
      query,
      req.body, 
      { new: true, runValidators: true } 
    );
    if (!course) return res.status(404).json({ message: 'Course not found or unauthorized.' });
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ message: 'Error updating course.' });
  }
};

const deleteCourse = async (req, res) => {
  try {
    let query = { _id: req.params.id };
    if (req.user && req.user.role && req.user.role.toLowerCase() !== 'admin') {
      query.instructor = req.user.id;
    }

    const course = await Course.findOneAndDelete(query);
    if (!course) return res.status(404).json({ message: 'Course not found or unauthorized.' });
    res.status(200).json({ success: true, message: 'Course deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course.' });
  }
};

const addQA = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const newQA = {
      user: req.body.user,
      text: req.body.text
    };

    course.qaList.push(newQA);
    await course.save();

    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ message: 'Error posting question.' });
  }
};

// 🚨 NAYA FUNCTION: Comment Delete karne ke liye
const deleteQA = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Jo comment ID aayi hai usko filter karke hata do
    course.qaList = course.qaList.filter(qa => qa._id.toString() !== req.params.qaId);
    
    await course.save();

    res.status(200).json({ success: true, message: 'Comment permanently deleted.', course });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment.' });
  }
};

// 🚨 THE FIX: Aakhiri line mein deleteQA ko bhi export kar diya hai
module.exports = { createCourse, getCourses, updateCourse, deleteCourse, getAllCourses, addQA, deleteQA };