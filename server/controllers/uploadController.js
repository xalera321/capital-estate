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
        // List of explicitly supported image MIME types
        const supportedMimeTypes = [
            'image/jpeg', 
            'image/png', 
            'image/gif', 
            'image/webp'
        ];
        
        // Accept only supported image formats
        if (supportedMimeTypes.includes(file.mimetype) || file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WebP)'));
        }
    }
});

// Handle photo upload
exports.uploadPhotos = (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        // Map file paths to URLs with additional metadata
        const uploads = req.files.map(file => {
            // Get file extension to determine format
            const ext = path.extname(file.filename).toLowerCase().substring(1);
            const format = ext === 'webp' ? 'WebP' : 
                          ext === 'jpg' || ext === 'jpeg' ? 'JPEG' : 
                          ext === 'png' ? 'PNG' : 
                          ext === 'gif' ? 'GIF' : 'Unknown';
            
            return {
                url: `/uploads/properties/${file.filename}`,
                originalName: file.originalname,
                size: file.size,
                format: format,
                mimeType: file.mimetype
            };
        });

        // Extract just the URLs for backward compatibility
        const urls = uploads.map(upload => upload.url);

        res.status(200).json({ 
            message: 'Files uploaded successfully', 
            count: req.files.length,
            urls,
            uploads // Include detailed info about each upload
        });
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).json({ error: error.message });
    }
};

// Middleware for handling uploads
exports.handleUpload = upload.array('photos', 10); // Allow up to 10 photos 