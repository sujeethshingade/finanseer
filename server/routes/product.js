const express = require('express');
const { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getProductAnalytics 
} = require('../controllers/product');

const router = express.Router();

router.get('/', getProducts);
router.get('/analytics', getProductAnalytics);
router.get('/:id', getProduct);
router.post('/', createProduct);
router.patch('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router; 