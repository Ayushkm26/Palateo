const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

async function createAdmin() {
  try {
    // Admin details
    const admin = {
      id: 1,
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      email: 'admin@foodieexpress.com',
      role: 'admin',
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    // Format the admin array
    const adminData = `const admins = [
  {
    id: ${admin.id},
    username: '${admin.username}',
    password: '${admin.password}', // hashed 'admin123'
    email: '${admin.email}',
    role: '${admin.role}',
    createdAt: '${admin.createdAt}',
    lastLogin: null
  }
];

module.exports = admins;`;

    // Write to file
    fs.writeFileSync(
      path.join(__dirname, '..', 'data', 'admins.js'), 
      adminData, 
      'utf8'
    );

    console.log('Admin created successfully!');
    console.log('Username:', admin.username);
    console.log('Password: admin123');
    console.log('Hash:', admin.password);
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

createAdmin(); 