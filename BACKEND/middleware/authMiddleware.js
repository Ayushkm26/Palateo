const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your-secret-key'; // Should be in env variables in production

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.owner = verified;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

const verifyRestaurantOwner = async (req, res, next) => {
    try {
        // Check if the owner is trying to modify their own restaurant's menu
        const restaurantId = parseInt(req.params.id);
        if (req.owner.restaurantId !== restaurantId) {
            return res.status(403).json({ 
                message: 'Access denied. You can only modify your own restaurant\'s menu.' 
            });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error verifying restaurant ownership' });
    }
};

module.exports = {
    authenticateToken,
    verifyRestaurantOwner
}; 