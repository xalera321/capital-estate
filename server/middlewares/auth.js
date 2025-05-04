const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log('Auth middleware called');
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        console.log('No Bearer token found in Authorization header:', authHeader);
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token found, verifying...');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token verified successfully, adminId:', decoded.id);
        req.adminId = decoded.id;
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        res.status(401).json({ error: 'Invalid token' });
    }
};