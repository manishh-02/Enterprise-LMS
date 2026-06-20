const express = require('express');
const router = express.Router();
const { getWorkforceData } = require('../controllers/hrController');
const { protect } = require('../middleware/authMiddleware');

// Route to fetch workforce analytics
router.get('/workforce', protect, getWorkforceData);

module.exports = router;