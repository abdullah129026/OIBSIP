import mongoose from 'mongoose';

import { ORDER_STATUS, PAYMENT_STATUS } from '../utils/constants.js';

const orderItemSchema = new mongoose.Schema(
  {
    base: { type: String, required: true },
    sauce: { type: String, required: true },
    cheese: { type: String, required: true },
    veggies: { type: [String], default: [] },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentId: { type: String },
    razorpayOrderId: { type: String },
    paymentStatus: { type: String, enum: PAYMENT_STATUS, default: 'pending' },
    status: { type: String, enum: ORDER_STATUS, default: 'received' },
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
