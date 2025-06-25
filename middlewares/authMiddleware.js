const jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.userId };
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token', error: err });
    }
};
