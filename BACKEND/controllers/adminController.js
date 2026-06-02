const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const adminModel = require('../data/admins');
const JWT_SECRET = process.env.JWT_SECRET || 'admin-secret-key'; // Should be in env variables
const JWT_EXPIRES_IN = '1h'; // 1 hour expiration

// Login for admin
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin by username
    const admin = await adminModel.findOne({ username:username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, admin.password);
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token with admin role claim
    const token = jwt.sign(
      { 
        id: admin.id, 
        username: admin.username, 
        role: admin.role 
      }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Set cookie with HttpOnly flag for security
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure in production
      maxAge: 3600000, // 1 hour in milliseconds
      sameSite: 'strict'
    });

    // Return success with admin details (excluding password)
    const { password: _, ...adminData } = admin;
    res.status(200).json({
      message: 'Login successful',
      admin: adminData,
      token // Include token in response for clients that don't support cookies
    });
    
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during admin login' });
  }
};

// Get admin profile
const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const admin = await adminModel.findOne({ id: adminId });
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Return admin data without password
    const { password: _, ...adminData } = admin;
    res.status(200).json(adminData);
    
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({ message: 'Server error when fetching admin profile' });
  }
};

// Logout admin
const logoutAdmin = (req, res) => {
  res.clearCookie('admin_token');
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
  loginAdmin,
  getAdminProfile,
  logoutAdmin
}; 