import 'dotenv/config';

import bcrypt from 'bcrypt';

import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Pizza } from '../models/Pizza.js';
import { Inventory } from '../models/Inventory.js';
import { BCRYPT_ROUNDS } from './constants.js';
import mongoose from 'mongoose';

const inventory = [
  { type: 'base', name: 'Thin Crust', price: 0, stock: 100, threshold: 20 },
  { type: 'base', name: 'Thick Crust', price: 1.0, stock: 100, threshold: 20 },
  { type: 'base', name: 'Cheese Burst', price: 2.5, stock: 80, threshold: 20 },
  { type: 'base', name: 'Whole Wheat', price: 1.5, stock: 60, threshold: 15 },
  { type: 'base', name: 'Gluten Free', price: 2.0, stock: 50, threshold: 15 },

  { type: 'sauce', name: 'Classic Marinara', price: 0, stock: 100, threshold: 20 },
  { type: 'sauce', name: 'Spicy Arrabbiata', price: 1.0, stock: 90, threshold: 20 },
  { type: 'sauce', name: 'Creamy Alfredo', price: 1.0, stock: 80, threshold: 20 },
  { type: 'sauce', name: 'BBQ Glaze', price: 1.25, stock: 70, threshold: 15 },
  { type: 'sauce', name: 'Pesto Basil', price: 1.5, stock: 60, threshold: 15 },

  { type: 'cheese', name: 'Mozzarella', price: 0, stock: 120, threshold: 25 },
  { type: 'cheese', name: 'Cheddar', price: 1.0, stock: 90, threshold: 20 },
  { type: 'cheese', name: 'Parmesan', price: 1.5, stock: 70, threshold: 15 },
  { type: 'cheese', name: 'Vegan Cheese', price: 2.0, stock: 50, threshold: 15 },

  { type: 'veggie', name: 'Mushroom', price: 0.75, stock: 100, threshold: 20 },
  { type: 'veggie', name: 'Onion', price: 0.5, stock: 100, threshold: 20 },
  { type: 'veggie', name: 'Capsicum', price: 0.75, stock: 100, threshold: 20 },
  { type: 'veggie', name: 'Black Olives', price: 0.9, stock: 80, threshold: 15 },
  { type: 'veggie', name: 'Jalapeno', price: 0.9, stock: 80, threshold: 15 },
  { type: 'veggie', name: 'Sweet Corn', price: 0.5, stock: 90, threshold: 20 },
  { type: 'veggie', name: 'Tomato', price: 0.5, stock: 90, threshold: 20 },
  { type: 'veggie', name: 'Paneer', price: 1.5, stock: 70, threshold: 15 },
];

const pizzas = [
  { name: 'Margherita', description: 'Classic marinara, fresh mozzarella, basil.', price: 8.99, image: '/pizzas/p5.jpg' },
  { name: 'Farmhouse', description: 'Onion, capsicum, mushroom, tomato on mozzarella.', price: 9.49, image: '/pizzas/p9.jpg' },
  { name: 'Peppy Paneer', description: 'Paneer, capsicum, red paprika, spicy marinara.', price: 10.99, image: '/pizzas/p4.jpg' },
  { name: 'Veggie Supreme', description: 'Loaded with seven fresh garden veggies.', price: 11.99, image: '/pizzas/p3.jpg' },
  { name: 'Mexican Green Wave', description: 'Jalapeno, onion, capsicum, arrabbiata kick.', price: 12.49, image: '/pizzas/p6.jpg' },
  { name: 'Cheese Overload', description: 'Mozzarella, cheddar, parmesan triple blend.', price: 13.99, image: '/pizzas/p7.jpg' },
];

const seed = async () => {
  try {
    await connectDB();

    await Promise.all([
      Inventory.deleteMany({}),
      Pizza.deleteMany({}),
      User.deleteMany({ role: 'admin' }),
    ]);

    await Inventory.insertMany(inventory);
    await Pizza.insertMany(pizzas);

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@pizzacrave.test';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const hash = await bcrypt.hash(adminPassword, BCRYPT_ROUNDS);

    await User.create({
      name: 'PizzaCrave Admin',
      email: adminEmail,
      password: hash,
      role: 'admin',
      isVerified: true,
    });

    console.log(`[seed] inventory: ${inventory.length}, pizzas: ${pizzas.length}, admin: ${adminEmail}`);
    console.log('[seed] done');
  } catch (err) {
    console.error('[seed] failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seed();
