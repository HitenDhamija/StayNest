const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Checks user is logged in based on passed token and set the user in request
exports.isLoggedIn = async (req, res, next) => {
    // token could be found in request cookies or in request headers
    let token = req.cookies.token;
    if (!token && req.header('Authorization')) {
        token = req.header('Authorization').replace('Bearer ', '');
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Login first to access this page',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Please login again.',
            });
        }
        next();
    } catch (error) {
        console.error('JWT verification error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
        });
    }
};
