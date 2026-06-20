const path = require('path'); 
const mongoose = require('mongoose');
const express = require('express');
const uploadRoutes = require('./routes/uploadRoutes');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const hrRoutes = require('./routes/hrRoutes');

// function call to connect database
connectDB();
// Add this line after connectDB()
mongoose.set('strictQuery', false);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/api/admin', adminRoutes);
app.use('/api/hr', hrRoutes);

// Test Route
app.get('/api/test', (req, res) => {
    res.json({ message: "Hello Developer! The backend server is running successfully." });
});

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
app.use('/api/upload', uploadRoutes);

// Linking Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

// ==========================================
// PRODUCTION FRONTEND SERVING (FIXED CODE)
// ==========================================
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Naya Fix: app.get('*') hata kar app.use() kar diya
app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
});
// ==========================================

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});