const Product = require('../models/Product');
const Transaction = require('../models/Transaction');

// @desc    Get all products
// @route   GET /api/product
// @access  Private
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Get a product by ID
// @route   GET /api/product/:id
// @access  Private
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/product
// @access  Private
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PATCH /api/product/:id
// @access  Private
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/product/:id
// @access  Private
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if product is used in transactions
    const transactions = await Transaction.findOne({ productId: id });
    if (transactions) {
      return res.status(400).json({ 
        message: 'Cannot delete product that is associated with transactions' 
      });
    }
    
    await Product.findByIdAndRemove(id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product revenue analytics
// @route   GET /api/product/analytics
// @access  Private
const getProductAnalytics = async (req, res) => {
  try {
    // Aggregate transactions by product to get revenue per product
    const productRevenue = await Transaction.aggregate([
      { 
        $match: { 
          type: 'income',
          userId: req.userId
        } 
      },
      {
        $group: {
          _id: '$productId',
          totalRevenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $project: {
          _id: 1,
          name: '$product.name',
          totalRevenue: 1,
          count: 1
        }
      },
      {
        $sort: { totalRevenue: -1 }
      }
    ]);
    
    res.status(200).json(productRevenue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getProductAnalytics
}; 