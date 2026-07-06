import { Inventory } from '../models/Inventory.js';
import { INVENTORY_TYPES, PIZZA_BASE_PRICE } from '../utils/constants.js';

const publicOption = (item) => ({
  id: item._id,
  name: item.name,
  price: item.price,
});

export const getBuilderOptions = async (req, res) => {
  try {
    const items = await Inventory.find({ stock: { $gt: 0 } }).sort({ price: 1, name: 1 });

    const options = INVENTORY_TYPES.reduce((acc, type) => {
      acc[type] = items.filter((i) => i.type === type).map(publicOption);
      return acc;
    }, {});

    res.json({ success: true, data: { basePrice: PIZZA_BASE_PRICE, options } });
  } catch (err) {
    console.error('[inventory/getBuilderOptions]', err.message);
    res.status(500).json({ success: false, error: 'Could not load builder options. Please try again.' });
  }
};

export const getAllInventory = async (req, res) => {
  try {
    const items = await Inventory.find().sort({ type: 1, name: 1 });

    const grouped = INVENTORY_TYPES.reduce((acc, type) => {
      acc[type] = items.filter((i) => i.type === type);
      return acc;
    }, {});

    res.json({ success: true, data: { inventory: grouped } });
  } catch (err) {
    console.error('[inventory/getAllInventory]', err.message);
    res.status(500).json({ success: false, error: 'Could not load inventory. Please try again.' });
  }
};

export const updateInventoryStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock, threshold } = req.body;

    const item = await Inventory.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found.' });
    }

    if (stock !== undefined) item.stock = stock;
    if (threshold !== undefined) item.threshold = threshold;

    if (item.stock >= item.threshold) {
      item.alertedAt = undefined;
    }

    await item.save();

    res.json({ success: true, data: { item } });
  } catch (err) {
    console.error('[inventory/updateInventoryStock]', err.message);
    res.status(500).json({ success: false, error: 'Could not update inventory. Please try again.' });
  }
};
