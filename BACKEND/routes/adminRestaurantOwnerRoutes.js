const express = require('express');
const router = express.Router();
const restaurantOwnerModel = require('../data/restaurantOwners');

// Get owner by restaurant id
router.get('/by-restaurant/:restaurantId', async (req, res) => {
  try {
    const owner = await restaurantOwnerModel.findOne({ restaurantId: req.params.restaurantId });
    if (!owner) return res.status(404).json({ message: 'Owner not found' });
    res.json({ owner });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching owner' });
  }
});

module.exports = router;
