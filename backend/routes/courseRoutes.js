const express = require('express');
const router = express.Router();

// 🚨 THE FIX: Yahan addQA ke sath deleteQA ko bhi import kiya
const { 
  createCourse, 
  getCourses, 
  updateCourse, 
  deleteCourse, 
  getAllCourses,
  addQA,
  deleteQA // <--- NAYA IMPORT
} = require('../controllers/courseController');

const { protect, authorize } = require('../middleware/authMiddleware');

// 1. Get ALL courses for the Employee Dashboard
router.get('/all', protect, getAllCourses);

// 2. Get courses specifically for the logged-in Instructor
router.get('/', protect, authorize('instructor', 'admin'), getCourses);

// 3. Create a new course (Admin/Instructor)
router.post('/', protect, authorize('instructor', 'admin'), createCourse);

// 4. Q&A POST ROUTE (Ye route Player se questions catch karega)
router.post('/:id/qa', protect, addQA);

// 🚨 5. NAYA ROUTE: Comment Delete karne ka rasta
router.delete('/:id/qa/:qaId', protect, authorize('instructor', 'admin'), deleteQA);

// 6. Update and Delete a course
router.route('/:id')
  .put(protect, authorize('instructor', 'admin'), updateCourse)
  .delete(protect, authorize('instructor', 'admin'), deleteCourse);

module.exports = router;