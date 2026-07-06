import mongoose from 'mongoose';

const pizzaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: '' },
    isCustom: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Pizza = mongoose.model('Pizza', pizzaSchema);
