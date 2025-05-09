const express = require('express');
const { getKPIs, createKPI, getDashboardMetrics } = require('../controllers/kpi');

const router = express.Router();

router.get('/', getKPIs);
router.post('/', createKPI);
router.get('/dashboard', getDashboardMetrics);

module.exports = router; 