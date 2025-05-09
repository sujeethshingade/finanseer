const mongoose = require('mongoose');

const DailyDataSchema = new mongoose.Schema(
  {
    date: String,
    revenue: Number,
    expenses: Number,
  },
  { _id: false }
);

const MonthlyDataSchema = new mongoose.Schema(
  {
    month: String,
    revenue: Number,
    expenses: Number,
    operationalExpenses: Number,
    nonOperationalExpenses: Number,
  },
  { _id: false }
);

const KPISchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalProfit: Number,
    totalRevenue: Number,
    totalExpenses: Number,
    expensesByCategory: {
      type: Map,
      of: Number,
    },
    monthlyData: [MonthlyDataSchema],
    dailyData: [DailyDataSchema],
  },
  { timestamps: true }
);

const KPI = mongoose.model('KPI', KPISchema);
module.exports = KPI; 