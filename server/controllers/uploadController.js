const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/properties';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Extract property ID from route params if available (for property photo upload route)
        const propertyId = req.params.id || 'new';
        
        // Generate a clean filename by removing special characters from original name
        const originalName = path.parse(file.originalname).name;
        const cleanName = originalName.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 30);
        
        // Create a logical filename format: property-{id}-{cleaned-original-name}-{timestamp}{ext}
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        
        cb(null, `property-${propertyId}-${cleanName}-${timestamp}${ext}`);
    }
});

// Create multer upload instance
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only images
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Handle photo upload
exports.uploadPhotos = (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        // Map file paths to URLs
        const urls = req.files.map(file => {
            // Convert file path to URL - prepend the domain in production
            return `/uploads/properties/${file.filename}`;
        });

        res.status(200).json({ 
            message: 'Files uploaded successfully', 
            count: req.files.length,
            urls 
        });
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).json({ error: error.message });
    }
};

// Middleware for handling uploads
exports.handleUpload = upload.array('photos', 10); // Allow up to 10 photos 