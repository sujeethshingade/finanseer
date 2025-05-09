/**
 * Calculate profit margin
 * @param {Number} revenue - Total revenue
 * @param {Number} profit - Total profit
 * @returns {Number} - Profit margin percentage
 */
const calculateProfitMargin = (revenue, profit) => {
  if (revenue <= 0) return 0;
  return parseFloat(((profit / revenue) * 100).toFixed(2));
};

/**
 * Calculate Return on Investment (ROI)
 * @param {Number} profit - Total profit
 * @param {Number} investment - Total investment
 * @returns {Number} - ROI percentage
 */
const calculateROI = (profit, investment) => {
  if (investment <= 0) return 0;
  return parseFloat(((profit / investment) * 100).toFixed(2));
};

/**
 * Calculate burn rate
 * @param {Number} expenses - Total expenses
 * @param {Number} months - Number of months
 * @returns {Number} - Monthly burn rate
 */
const calculateBurnRate = (expenses, months) => {
  if (months <= 0) return 0;
  return parseFloat((expenses / months).toFixed(2));
};

/**
 * Calculate revenue growth
 * @param {Number} currentRevenue - Current period revenue
 * @param {Number} previousRevenue - Previous period revenue
 * @returns {Number} - Growth percentage
 */
const calculateGrowthRate = (currentRevenue, previousRevenue) => {
  if (previousRevenue <= 0) return 0;
  return parseFloat((((currentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(2));
};

module.exports = {
  calculateProfitMargin,
  calculateROI,
  calculateBurnRate,
  calculateGrowthRate
}; 