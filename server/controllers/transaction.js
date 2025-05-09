const Transaction = require('../models/Transaction');
const KPI = require('../models/KPI');
const mongoose = require('mongoose');

// @desc    Get all transactions for a user
// @route   GET /api/transaction
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const { status, paymentMethod, startDate, endDate } = req.query;
    let query = { userId: req.userId };
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Filter by payment method
    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }
    
    // Filter by date range
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .populate('productId', 'name price');
      
    res.status(200).json(transactions);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Get a transaction by ID
// @route   GET /api/transaction/:id
// @access  Private
const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOne({ 
      _id: id, 
      userId: req.userId 
    }).populate('productId', 'name price');
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a transaction
// @route   POST /api/transaction
// @access  Private
const createTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { amount, type, category, productId } = req.body;
    
    // Create transaction
    const transaction = new Transaction({
      ...req.body,
      userId: req.userId,
    });
    
    await transaction.save({ session });
    
    // Update KPI data
    let kpi = await KPI.findOne({ userId: req.userId });
    
    if (!kpi) {
      // Create KPI document if it doesn't exist
      kpi = new KPI({
        userId: req.userId,
        totalRevenue: 0,
        totalExpenses: 0,
        totalProfit: 0,
        expensesByCategory: {},
        monthlyData: [],
        dailyData: [],
      });
    }
    
    // Update KPI amounts based on transaction type
    if (type === 'income') {
      kpi.totalRevenue += amount;
    } else if (type === 'expense') {
      kpi.totalExpenses += amount;
      
      // Update expenses by category
      const currentAmount = kpi.expensesByCategory.get(category) || 0;
      kpi.expensesByCategory.set(category, currentAmount + amount);
    }
    
    kpi.totalProfit = kpi.totalRevenue - kpi.totalExpenses;
    
    // Create/update monthly data
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    
    let monthlyData = kpi.monthlyData.find(data => data.month === month);
    
    if (!monthlyData) {
      kpi.monthlyData.push({
        month,
        revenue: type === 'income' ? amount : 0,
        expenses: type === 'expense' ? amount : 0,
        operationalExpenses: type === 'expense' && category === 'operational' ? amount : 0,
        nonOperationalExpenses: type === 'expense' && category === 'non-operational' ? amount : 0,
      });
    } else {
      if (type === 'income') {
        monthlyData.revenue += amount;
      } else if (type === 'expense') {
        monthlyData.expenses += amount;
        
        if (category === 'operational') {
          monthlyData.operationalExpenses += amount;
        } else if (category === 'non-operational') {
          monthlyData.nonOperationalExpenses += amount;
        }
      }
    }
    
    // Create/update daily data
    const day = date.toISOString().slice(0, 10);
    let dailyData = kpi.dailyData.find(data => data.date === day);
    
    if (!dailyData) {
      kpi.dailyData.push({
        date: day,
        revenue: type === 'income' ? amount : 0,
        expenses: type === 'expense' ? amount : 0,
      });
    } else {
      if (type === 'income') {
        dailyData.revenue += amount;
      } else if (type === 'expense') {
        dailyData.expenses += amount;
      }
    }
    
    await kpi.save({ session });
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(201).json(transaction);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(409).json({ message: error.message });
  }
};

// @desc    Update a transaction
// @route   PATCH /api/transaction/:id
// @access  Private
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: id, userId: req.userId }, 
      req.body, 
      { new: true }
    );
    
    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transaction/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedTransaction = await Transaction.findOneAndDelete({ 
      _id: id, 
      userId: req.userId 
    });
    
    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getTransactions, 
  getTransaction, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction 
}; 