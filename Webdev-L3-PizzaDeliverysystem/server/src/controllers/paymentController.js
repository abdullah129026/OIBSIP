import crypto from 'crypto';

import { razorpay } from '../config/razorpay.js';
import { priceSelection, PricingError } from '../services/pricingService.js';
import { createOrderFromSelection } from './orderController.js';
import { PAYMENT_CURRENCY } from '../utils/constants.js';

const handlePricingError = (err, res, area) => {
  if (err.isPricingError) {
    return res.status(400).json({ success: false, error: err.message });
  }
  console.error(area, err.message);
  return res
    .status(500)
    .json({ success: false, error: 'Payment could not be processed. Please try again.' });
};

export const createPaymentOrder = async (req, res) => {
  try {
    const priced = await priceSelection(req.body.selection);

    const rzpOrder = await razorpay.orders.create({
      amount: priced.amountInPaise,
      currency: PAYMENT_CURRENCY,
      receipt: `rcpt_${req.user._id}_${Date.now()}`,
    });

    res.json({
      success: true,
      data: {
        orderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        breakdown: {
          itemsTotal: priced.itemsTotal,
          deliveryFee: priced.deliveryFee,
          totalAmount: priced.totalAmount,
        },
      },
    });
  } catch (err) {
    handlePricingError(err, res, '[payment/createPaymentOrder]');
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      selection,
    } = req.body;

    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, error: 'Payment verification failed.' });
    }

    const priced = await priceSelection(selection);

    const order = await createOrderFromSelection({
      user: req.user,
      selection,
      priced,
      payment: {
        paymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        order: {
          id: order._id,
          totalAmount: order.totalAmount,
          status: order.status,
          paymentStatus: order.paymentStatus,
        },
      },
    });
  } catch (err) {
    handlePricingError(err, res, '[payment/verifyPayment]');
  }
};
