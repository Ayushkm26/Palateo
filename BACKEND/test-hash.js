const bcrypt = require('bcrypt');

// Function to compare password with hash
async function verifyPassword() {
  const password = 'admin123';
  const storedHash = '$2b$10$8OuAgNPnRFrHC4c/blx9c.K2Cl8fHm7ZqCuzMFqFoN2zZVMdjnfj.';
  
  try {
    const isMatch = await bcrypt.compare(password, storedHash);
    console.log(`Password match result: ${isMatch}`);
    
    // Generate a new hash for comparison
    const newHash = await bcrypt.hash(password, 10);
    console.log(`New hash generated: ${newHash}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

verifyPassword(); 