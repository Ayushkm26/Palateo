const express = require('express');
const router = express.Router();
const { getContacts, submitContact } = require('../controllers/contactController');

// Get all contacts
router.get('/', getContacts);

// Submit a new contact
router.post('/', submitContact);

module.exports = router;
