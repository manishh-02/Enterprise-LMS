const express = require('express');
const router = express.Router();

// Sabhi controllers import kar liye
const { 
  getAllUsers, 
  getPendingUsers, 
  provisionUser, 
  updateUser, 
  deleteUser 
} = require('../controllers/adminController');
const { getHRAnalytics } = require('../controllers/analyticsController');

// Sahi auth middleware import kiya
const { protect, authorize } = require('../middleware/authMiddleware');

// 🚨 SMART BOUNCERS 🚨
// 1. Sirf 'admin' ke liye (Dangerous actions ke liye like Delete)
const adminOnly = [protect, authorize('admin')];

// 2. 'admin' aur 'hr' dono ke liye (Management actions ke liye)
const adminAndHR = [protect, authorize('admin', 'hr')];

// ---------------- ROUTES ---------------- //

// GET & POST: Users list dekhna aur naya User banana (Admin aur HR dono kar sakte hain)
router.route('/users')
  .get(adminAndHR, getAllUsers)
  .post(adminAndHR, provisionUser);

// Analytics Route ko protect kar diya hai taaki secure rahe
router.get('/analytics', adminAndHR, getHRAnalytics);

// GET: Pending users check karna
router.route('/pending-users')
  .get(adminAndHR, getPendingUsers);

// PUT & DELETE: ID ke base par update ya delete karna
router.route('/users/:id')
  .put(adminAndHR, updateUser)     // Role/Status update HR aur Admin dono kar sakte hain
  .delete(adminOnly, deleteUser);  // LAKSHMAN REKHA: Delete sirf Admin kar payega!

module.exports = router;