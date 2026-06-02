const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'admin-secret-key'; // Should be in env variables

/**
 * Middleware to authenticate admin tokens
 * Checks for token in cookies first, then in Authorization header as fallback
 */
const authenticateAdmin = (req, res, next) => {
    // First check for token in cookies (more secure)
    const cookieToken = req.cookies?.admin_token;
    
    // Fallback to Authorization header (for API calls that don't support cookies)
    const authHeader = req.headers['authorization'];
    const headerToken = authHeader && authHeader.split(' ')[1];
    
    // Use cookie token if available, otherwise use header token
    const token = cookieToken || headerToken;

    if (!token) {
        return res.status(401).json({ 
            message: 'Access denied. Admin authentication required.' 
        });
    }

    try {
        // Verify the token
        const verified = jwt.verify(token, JWT_SECRET);
        
        // Check if the token has admin role (accept both 'admin' and 'super_admin')
        if (verified.role !== 'admin' && verified.role !== 'super_admin') {
            return res.status(403).json({ 
                message: 'Access denied. Admin privileges required.' 
            });
        }
        
        // Attach admin data to request
        req.admin = verified;
        next();
    } catch (error) {
        console.error('Admin auth error:', error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Admin session expired. Please login again.' });
        }
        res.status(403).json({ message: 'Invalid admin token' });
    }
};

module.exports = {
    authenticateAdmin
}; 