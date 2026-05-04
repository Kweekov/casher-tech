const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const ordersRoutes = require('./routes/ordersRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Маршруты
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});
app.use('/api/orders', ordersRoutes);
app.use('/api', analyticsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});