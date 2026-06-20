const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
require('dotenv').config();

// 1. Initialize S3 Client (Modern AWS SDK v3 approach)
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

// 2. Configure Multer to stream VIDEOS directly to S3
const uploadVideo = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    // acl: 'public-read', // Uncomment this if your bucket allows public ACLs
    contentType: multerS3.AUTO_CONTENT_TYPE, 
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      // Create a unique filename so old videos don't get overwritten
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      cb(null, `courses/videos/vid-${uniqueSuffix}${extension}`);
    }
  }),
  limits: {
    fileSize: 100 * 1024 * 1024 // 100 MB max limit to protect your free tier
  },
  fileFilter: (req, file, cb) => {
    // Security check: Only allow video files
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type! Only videos are allowed.'), false);
    }
  }
});

// 🚨 3. NAYA CONFIG PDF/NOTES UPLOAD KE LIYE (S3 me 'notes' folder me jayega)
const uploadPdf = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE, 
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      cb(null, `courses/notes/doc-${uniqueSuffix}${extension}`); // Folder alag kar diya
    }
  }),
  limits: {
    fileSize: 20 * 1024 * 1024 // 20 MB max limit for PDFs
  },
  fileFilter: (req, file, cb) => {
    // Security check: Only allow PDF and standard documents
    if (file.mimetype === 'application/pdf' || file.mimetype.includes('document')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type! Only PDFs or Documents are allowed.'), false);
    }
  }
});

// 🚨 THE FIX: Dono objects ko export kar rahe hain
module.exports = { s3, uploadVideo, uploadPdf };