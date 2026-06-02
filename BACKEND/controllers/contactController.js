const contactModel = require('../data/contacts');

// Get all contacts
const getContacts = async (req, res) => {
    try {
        const contacts = await contactModel.find({});
        res.json({ contacts });
    } catch (error) {
        console.error('Error getting contacts:', error);
        res.status(500).json({ message: 'Error retrieving contacts' });
    }
};

// Submit a new contact form
const submitContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newContact = await contactModel.create({ name, email, message });

        res.status(201).json({ 
            message: 'Contact form submitted successfully',
            contact: newContact 
        });
    } catch (error) {
        console.error('Error submitting contact:', error);
        res.status(500).json({ message: 'Error submitting contact form' });
    }
};

module.exports = {
    getContacts,
    submitContact
};
