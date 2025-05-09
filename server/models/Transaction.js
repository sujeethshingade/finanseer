const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'credit', 'debit', 'bank transfer'],
      default: 'cash',
    },
    description: String,
  },
  { timestamps: true }
);

const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction; 