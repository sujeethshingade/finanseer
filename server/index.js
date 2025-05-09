const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Routes
const kpiRoutes = require('./routes/kpi');
const productRoutes = require('./routes/product');
const transactionRoutes = require('./routes/transaction');
const userRoutes = require('./routes/user');

// Middleware
const { authMiddleware } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

// Config
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('common'));

// Routes
app.use('/api/kpi', authMiddleware, kpiRoutes);
app.use('/api/product', authMiddleware, productRoutes);
app.use('/api/transaction', authMiddleware, transactionRoutes);
app.use('/api/user', userRoutes);

// Error Handling
app.use(errorHandler);

// Database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`)); 