const express = require('express');
const router = express.Router();

// 🚨 THE FIX: 'uploadPdf' ko bhi import kiya
const { uploadVideo, uploadPdf } = require('../config/s3Setup');

// ==========================================
// 1. VIDEO UPLOAD ROUTE (Tera Original Code)
// ==========================================
router.post('/video', uploadVideo.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No video file provided or invalid file type.' });
    }
    const s3VideoUrl = req.file.location;
    const fileSizeMB = (req.file.size / (1024 * 1024)).toFixed(2);

    console.log(`[AWS S3] Video uploaded successfully: ${s3VideoUrl}`);

    res.status(200).json({
      success: true,
      message: 'Video uploaded to AWS S3 successfully.',
      videoUrl: s3VideoUrl,
      size: `${fileSizeMB} MB`
    });
  } catch (error) {
    console.error('[AWS S3 Error]:', error);
    res.status(500).json({ success: false, message: 'Server error during video upload.' });
  }
});

// ==========================================
// 🚨 2. NAYA PDF / NOTES UPLOAD ROUTE
// ==========================================
router.post('/pdf', uploadPdf.single('pdf'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No PDF file provided or invalid format.' });
    }
    
    // AWS S3 se URL milega
    const s3PdfUrl = req.file.location;
    
    console.log(`[AWS S3] PDF uploaded successfully: ${s3PdfUrl}`);

    res.status(200).json({
      success: true,
      message: 'PDF uploaded to AWS S3 successfully.',
      pdfUrl: s3PdfUrl // <--- Frontend isi naam ka wait kar raha hai
    });
  } catch (error) {
    console.error('[AWS S3 Error]:', error);
    res.status(500).json({ success: false, message: 'Server error during PDF upload.' });
  }
});

module.exports = router;