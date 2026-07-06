import { Pizza } from '../models/Pizza.js';

const publicPizza = (pizza) => ({
  id: pizza._id,
  name: pizza.name,
  description: pizza.description,
  price: pizza.price,
  image: pizza.image,
  isCustom: pizza.isCustom,
});

export const getPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find({ isCustom: false }).sort({ price: 1 });
    res.json({ success: true, data: { pizzas: pizzas.map(publicPizza) } });
  } catch (err) {
    console.error('[pizza/getPizzas]', err.message);
    res.status(500).json({ success: false, error: 'Could not load pizzas. Please try again.' });
  }
};
