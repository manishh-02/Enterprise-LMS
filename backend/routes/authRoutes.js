const express = require('express');
const router = express.Router();

// Controller se functions import kar rahe hain
const { registerUser, loginUser } = require('../controllers/authController');

// Routes define kar rahe hain
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;