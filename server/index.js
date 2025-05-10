const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

const kpiRoutes = require('./routes/kpi');
const productRoutes = require('./routes/product');
const transactionRoutes = require('./routes/transaction');
const userRoutes = require('./routes/user');

const { authMiddleware } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(morgan('common'));

app.use('/api/kpi', authMiddleware, kpiRoutes);
app.use('/api/product', authMiddleware, productRoutes);
app.use('/api/transaction', authMiddleware, transactionRoutes);
app.use('/api/user', userRoutes);

app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`)); 
  