const User = require('../models/User');
const Course = require('../models/Course');

const getHRAnalytics = async (req, res) => {
  try {
    // Basic counts - No complex aggregation to keep it simple
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'Active' });
    const totalCourses = await Course.countDocuments();
    
    // Calculate pending users safely
    const pendingUsers = totalUsers - activeUsers;

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          activeUsers,
          totalCourses,
          pendingUsers: pendingUsers < 0 ? 0 : pendingUsers
        }
      }
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ message: 'Error fetching dashboard data.' });
  }
};

module.exports = { getHRAnalytics };