import 'dotenv/config';

import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { startStockWatcher } from './src/jobs/stockWatcher.js';

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    startStockWatcher();
    app.listen(PORT, () => {
      console.log(`[server] listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('[server] failed to start:', err.message);
    process.exit(1);
  }
};

start();
