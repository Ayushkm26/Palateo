const menuModel = require('../data/menus');

const menuController = {
  // Get menu for a specific restaurant
  async getMenuByRestaurantId(req, res) {
    try {
      const { id: restaurantId } = req.params;

      const menu = await menuModel.findOne({ restaurantId });

      if (!menu) {
        return res.json({ success: true, menu: [] });
      }

      res.json({ success: true, menu: menu.items });
    } catch (error) {
      console.error('Error fetching menu:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch menu' });
    }
  },

  // Add a single menu item to a restaurant
  async addMenuItem(req, res) {
    try {
      const { id: restaurantId } = req.params;
      const { name, image, price, description, type } = req.body;

      if (!name || !price || !description || !type) {
        return res.status(400).json({ success: false, message: 'Invalid menu item. Must include name, price, description, and type' });
      }

      // Assign a unique id to the menu item
      const menuItem = {
        id: Date.now().toString(), // or use uuid if you prefer
        name,
        image,
        price,
        description,
        type
      };

      const menu = await menuModel.findOneAndUpdate(
        { restaurantId },
        { $push: { items: menuItem } },
        { new: true, upsert: true }
      );

      res.status(201).json({
        success: true,
        message: 'Menu item added successfully',
        menuItem: menu.items[menu.items.length - 1] // return the last added item
      });
    } catch (error) {
      console.error('Error adding menu item:', error);
      res.status(500).json({ success: false, message: 'Failed to add menu item' });
    }
  },

  // Add full menu for a specific restaurant (replace existing)
  async addMenuForRestaurant(req, res) {
    try {
      const { id: restaurantId } = req.params;
      const menuItems = req.body;

      if (!Array.isArray(menuItems)) {
        return res.status(400).json({ success: false, message: 'Menu items must be an array' });
      }

      const isValid = menuItems.every(item =>
        item.name && item.image && item.price && item.type && ['Veg', 'Non-Veg'].includes(item.type)
      );

      if (!isValid) {
        return res.status(400).json({ success: false, message: 'Each item must have name, image, price, and valid type (Veg/Non-Veg)' });
      }

      const updatedMenu = await menuModel.findOneAndUpdate(
        { restaurantId },
        { items: menuItems },
        { new: true, upsert: true }
      );

      res.status(201).json({
        success: true,
        message: 'Menu added/updated successfully',
        menu: updatedMenu.items
      });
    } catch (error) {
      console.error('Error adding menu:', error);
      res.status(500).json({ success: false, message: 'Failed to add menu' });
    }
  },

  // Delete a menu item
  async deleteMenuItem(req, res) {
    try {
      const { id: restaurantId, itemId } = req.params;

      // Try to delete by _id (default for MongoDB subdocs)
      let updatedMenu = await menuModel.findOneAndUpdate(
        { restaurantId },
        { $pull: { items: { _id: itemId } } },
        { new: true }
      );

      // If not found, try to delete by custom id field (for legacy data)
      if (!updatedMenu || updatedMenu.items.length === (await menuModel.findOne({ restaurantId })).items.length) {
        updatedMenu = await menuModel.findOneAndUpdate(
          { restaurantId },
          { $pull: { items: { id: itemId } } },
          { new: true }
        );
      }

      if (!updatedMenu) {
        return res.status(404).json({ success: false, message: 'Restaurant menu not found' });
      }

      res.json({
        success: true,
        message: 'Menu item deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting menu item:', error);
      res.status(500).json({ success: false, message: 'Failed to delete menu item' });
    }
  }
};

module.exports = menuController;
