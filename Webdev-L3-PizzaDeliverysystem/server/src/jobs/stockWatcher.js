import cron from 'node-cron';
import { Inventory } from '../models/Inventory.js';
import { sendLowStockEmail } from '../services/emailService.js';

export const startStockWatcher = () => {
  cron.schedule(process.env.STOCK_CRON || '0 * * * *', async () => {
    try {
      const items = await Inventory.find({
        $expr: { $lt: ['$stock', '$threshold'] },
        alertedAt: null
      });

      if (items.length > 0) {
        await sendLowStockEmail(process.env.ADMIN_EMAIL, items);

        const now = new Date();
        for (const item of items) {
          item.alertedAt = now;
          await item.save();
        }
      }
    } catch (err) {
      console.error('[jobs/stockWatcher]', err.message);
    }
  });
};
