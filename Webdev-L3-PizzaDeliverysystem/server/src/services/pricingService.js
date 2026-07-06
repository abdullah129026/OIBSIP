import { Inventory } from '../models/Inventory.js';
import { PIZZA_BASE_PRICE, DELIVERY_FEE } from '../utils/constants.js';

const round2 = (n) => Math.round(n * 100) / 100;

class PricingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PricingError';
    this.isPricingError = true;
  }
}

const findInStock = (items, type, name) => {
  const match = items.find(
    (i) => i.type === type && i.name === name && i.stock > 0
  );
  if (!match) {
    throw new PricingError(`"${name}" is unavailable. Please rebuild your pizza.`);
  }
  return match;
};

export const priceSelection = async (selection) => {
  const { base, sauce, cheese, veggies = [] } = selection ?? {};

  if (!base || !sauce || !cheese) {
    throw new PricingError('Your pizza is missing a base, sauce, or cheese.');
  }
  if (!Array.isArray(veggies)) {
    throw new PricingError('Invalid veggie selection.');
  }

  const items = await Inventory.find({ stock: { $gt: 0 } });

  const baseItem = findInStock(items, 'base', base);
  const sauceItem = findInStock(items, 'sauce', sauce);
  const cheeseItem = findInStock(items, 'cheese', cheese);
  const veggieItems = veggies.map((name) => findInStock(items, 'veggie', name));

  const inventoryIds = [
    baseItem._id,
    sauceItem._id,
    cheeseItem._id,
    ...veggieItems.map((v) => v._id),
  ];

  const pizzaPrice = round2(
    PIZZA_BASE_PRICE +
      baseItem.price +
      sauceItem.price +
      cheeseItem.price +
      veggieItems.reduce((sum, v) => sum + v.price, 0)
  );

  const orderItem = {
    base: baseItem.name,
    sauce: sauceItem.name,
    cheese: cheeseItem.name,
    veggies: veggieItems.map((v) => v.name),
    price: pizzaPrice,
  };

  const totalAmount = round2(pizzaPrice + DELIVERY_FEE);

  return {
    item: orderItem,
    inventoryIds,
    itemsTotal: pizzaPrice,
    deliveryFee: DELIVERY_FEE,
    totalAmount,
    amountInPaise: Math.round(totalAmount * 100),
  };
};

export { PricingError };
