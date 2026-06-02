const express = require('express');
const router = express.Router();
const { 
    loginAdmin, 
    getAdminProfile,
    logoutAdmin
} = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/adminAuthMiddleware');

// Public admin routes
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);

// Protected admin routes
router.get('/profile', authenticateAdmin, getAdminProfile);

// Add more admin routes here as needed, all protected by authenticateAdmin middleware
// For example:
// router.get('/dashboard-stats', authenticateAdmin, getDashboardStats);

module.exports = router; 