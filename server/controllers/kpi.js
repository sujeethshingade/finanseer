const KPI = require('../models/KPI');
const Transaction = require('../models/Transaction');

// @desc    Get all KPIs for a user
// @route   GET /api/kpi
// @access  Private
const getKPIs = async (req, res) => {
  try {
    const kpis = await KPI.find({ userId: req.userId });
    res.status(200).json(kpis);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Create a KPI entry
// @route   POST /api/kpi
// @access  Private
const createKPI = async (req, res) => {
  try {
    const kpi = new KPI({
      ...req.body,
      userId: req.userId,
    });
    await kpi.save();
    res.status(201).json(kpi);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// @desc    Get dashboard metrics
// @route   GET /api/kpi/dashboard
// @access  Private
const getDashboardMetrics = async (req, res) => {
  try {
    // Get KPI data
    const kpiData = await KPI.findOne({ userId: req.userId });
    
    if (!kpiData) {
      return res.status(404).json({ message: "No KPI data found" });
    }

    // Get recent transactions
    const recentTransactions = await Transaction.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('productId', 'name price');

    // Calculate basic metrics
    const profitMargin = kpiData.totalRevenue > 0 
      ? (kpiData.totalProfit / kpiData.totalRevenue) * 100 
      : 0;

    res.status(200).json({
      totalRevenue: kpiData.totalRevenue || 0,
      totalExpenses: kpiData.totalExpenses || 0,
      totalProfit: kpiData.totalProfit || 0,
      profitMargin: parseFloat(profitMargin.toFixed(2)) || 0,
      monthlyData: kpiData.monthlyData || [],
      dailyData: kpiData.dailyData || [],
      expensesByCategory: kpiData.expensesByCategory || {},
      recentTransactions: recentTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getKPIs, createKPI, getDashboardMetrics }; 