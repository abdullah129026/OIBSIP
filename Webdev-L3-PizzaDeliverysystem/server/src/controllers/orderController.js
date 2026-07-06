import { Order } from '../models/Order.js';
import { Inventory } from '../models/Inventory.js';
import { ORDER_STATUS } from '../utils/constants.js';

const summariseItems = (items) =>
  items
    .map((it) => {
      const veg = it.veggies?.length ? ` · ${it.veggies.join(', ')}` : '';
      return `Custom Pizza · ${it.base}${veg}`;
    })
    .join(' + ');

const publicOrder = (order) => ({
  id: order._id,
  user: order.user, // May be populated with name/email for admin
  items: summariseItems(order.items),
  total: order.totalAmount,
  status: order.status,
  paymentStatus: order.paymentStatus,
  placed: order.createdAt,
});

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: { orders: orders.map(publicOrder) } });
  } catch (err) {
    console.error('[order/getMyOrders]', err.message);
    res.status(500).json({ success: false, error: 'Could not load your orders. Please try again.' });
  }
};

export const createOrderFromSelection = async ({ user, selection, priced, payment }) => {
  const order = await Order.create({
    user: user._id,
    items: [priced.item],
    totalAmount: priced.totalAmount,
    paymentId: payment.paymentId,
    razorpayOrderId: payment.razorpayOrderId,
    paymentStatus: 'paid',
    status: 'received',
  });

  await Promise.all(
    priced.inventoryIds.map((id) =>
      Inventory.findByIdAndUpdate(id, { $inc: { stock: -1 } })
    )
  );

  return order;
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: { orders: orders.map(publicOrder) } });
  } catch (err) {
    console.error('[order/getAllOrders]', err.message);
    res.status(500).json({ success: false, error: 'Could not load orders. Please try again.' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!ORDER_STATUS.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid order status.' });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }

    res.json({ success: true, data: { order: publicOrder(order) } });
  } catch (err) {
    console.error('[order/updateOrderStatus]', err.message);
    res.status(500).json({ success: false, error: 'Could not update order status. Please try again.' });
  }
};
