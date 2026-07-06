import mongoose from 'mongoose';

import { INVENTORY_TYPES } from '../utils/constants.js';

const inventorySchema = new mongoose.Schema(
  {
    type: { type: String, enum: INVENTORY_TYPES, required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0, default: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    threshold: { type: Number, required: true, min: 0, default: 20 },
    unit: { type: String, default: 'units' },
    alertedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Inventory = mongoose.model('Inventory', inventorySchema);
