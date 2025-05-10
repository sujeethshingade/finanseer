const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const KPI = require('../models/KPI');

dotenv.config();

// Sample user data
const sampleUser = {
  name: 'Admin',
  email: 'test@gmail.com',
  password: 'password123',
  role: 'admin'
};

// Sample products data
const sampleProducts = [
  {
    name: 'Laptop',
    description: 'High-performance laptop',
    price: 999.99,
    category: 'Electronics',
    quantity: 50,
    sku: 'LAP-001'
  },
  {
    name: 'Smartphone',
    description: 'Latest model smartphone',
    price: 699.99,
    category: 'Electronics',
    quantity: 100,
    sku: 'PHN-001'
  },
  {
    name: 'Headphones',
    description: 'Wireless noise-cancelling headphones',
    price: 199.99,
    category: 'Electronics',
    quantity: 75,
    sku: 'AUD-001'
  },
  {
    name: 'Desk Chair',
    description: 'Ergonomic office chair',
    price: 299.99,
    category: 'Furniture',
    quantity: 30,
    sku: 'FUR-001'
  },
  {
    name: 'Monitor',
    description: '27-inch 4K monitor',
    price: 399.99,
    category: 'Electronics',
    quantity: 40,
    sku: 'MON-001'
  }
];

// Generate transactions
const generateTransactions = (userId, products) => {
  const transactions = [];
  const now = new Date();
  
  // Generate transactions for the last 90 days
  for (let i = 90; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate 1-3 transactions per day
    const transactionsPerDay = Math.floor(Math.random() * 3) + 1;
    
    for (let j = 0; j < transactionsPerDay; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const amount = product.price * quantity;
      
      transactions.push({
        userId: userId,
        productId: product._id,
        amount: amount,
        type: 'income',
        category: 'sales',
        paymentMethod: ['credit', 'debit', 'cash'][Math.floor(Math.random() * 3)],
        status: 'completed',
        createdAt: new Date(date)
      });
    }
  }
  
  return transactions;
};

// Generate monthly data
const generateMonthlyData = (transactions) => {
  const months = [];
  const now = new Date();
  
  for (let i = 2; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    
    const monthTransactions = transactions.filter(t => {
      const txDate = new Date(t.createdAt);
      return txDate.getMonth() === date.getMonth() && 
             txDate.getFullYear() === date.getFullYear();
    });
    
    const revenue = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
    const expenses = revenue * 0.6; // 60% of revenue as expenses
    const operationalExpenses = expenses * 0.4;
    const nonOperationalExpenses = expenses * 0.6;
    
    months.push({
      month,
      revenue,
      expenses,
      operationalExpenses,
      nonOperationalExpenses
    });
  }
  
  return months;
};

// Generate daily data
const generateDailyData = (transactions) => {
  const dailyData = [];
  const now = new Date();
  
  for (let i = 90; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const day = date.toISOString().slice(0, 10);
    
    const dayTransactions = transactions.filter(t => {
      const txDate = new Date(t.createdAt);
      return txDate.toISOString().slice(0, 10) === day;
    });
    
    const revenue = dayTransactions.reduce((sum, t) => sum + t.amount, 0);
    const expenses = revenue * 0.6; // 60% of revenue as expenses
    
    dailyData.push({
      date: day,
      revenue,
      expenses
    });
  }
  
  return dailyData;
};

// Main seeding function
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Transaction.deleteMany({});
    await KPI.deleteMany({});
    console.log('Cleared existing data');

    // Create demo user
    const user = await User.create(sampleUser);
    console.log('Created demo user');

    // Create products
    const createdProducts = await Product.create(sampleProducts);
    console.log('Created products');

    // Generate and create transactions
    const transactions = generateTransactions(user._id, createdProducts);
    await Transaction.create(transactions);
    console.log('Created transactions');

    // Calculate KPI metrics
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = totalRevenue * 0.6; // 60% of revenue as expenses
    const totalProfit = totalRevenue - totalExpenses;

    // Create KPI data
    const kpiData = {
      userId: user._id,
      totalRevenue,
      totalExpenses,
      totalProfit,
      expensesByCategory: {
        operational: totalExpenses * 0.4,
        nonOperational: totalExpenses * 0.6
      },
      monthlyData: generateMonthlyData(transactions),
      dailyData: generateDailyData(transactions)
    };

    await KPI.create(kpiData);
    console.log('Created KPI data');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase(); 