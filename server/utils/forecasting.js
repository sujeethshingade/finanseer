/**
 * Perform a simple linear regression forecast
 * @param {Array} data - Historical data array of {x, y} values where x is the time period and y is the value
 * @param {Number} periods - Number of periods to forecast
 * @returns {Array} - Forecasted values
 */
const linearRegressionForecast = (data, periods) => {
  if (!data || data.length < 2 || periods <= 0) {
    return [];
  }

  const n = data.length;
  const xValues = Array.from({ length: n }, (_, i) => i);
  const yValues = data.map(d => d.y);

  const xMean = xValues.reduce((a, b) => a + b, 0) / n;
  const yMean = yValues.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
    denominator += (xValues[i] - xMean) ** 2;
  }

  const slope = numerator / denominator;
  const yIntercept = yMean - slope * xMean;

  const forecast = [];
  const lastX = xValues[n - 1];

  for (let i = 1; i <= periods; i++) {
    const x = lastX + i;
    const y = slope * x + yIntercept;
    forecast.push({
      x,
      y: Math.max(0, parseFloat(y.toFixed(2)))
    });
  }

  return forecast;
};

/**
 * Calculate moving average forecast
 * @param {Array} data - Historical data array of values
 * @param {Number} periods - Number of periods for the moving average
 * @param {Number} forecastPeriods - Number of periods to forecast
 * @returns {Array} - Forecasted values
 */
const movingAverageForecast = (data, periods, forecastPeriods) => {
  if (!data || data.length < periods || forecastPeriods <= 0) {
    return [];
  }

  const forecast = [];
  const n = data.length;

  let sum = 0;
  for (let i = n - periods; i < n; i++) {
    sum += data[i];
  }
  let movingAvg = sum / periods;

  for (let i = 0; i < forecastPeriods; i++) {
    forecast.push(parseFloat(movingAvg.toFixed(2)));
  }

  return forecast;
};

/**
 * Predict financial metrics for the next X months
 * @param {Array} monthlyData - Array of monthly data
 * @param {Number} months - Number of months to predict
 * @returns {Object} - Predicted financial metrics
 */
const predictFinancialMetrics = (monthlyData, months = 3) => {
  if (!monthlyData || monthlyData.length < 6) {
    return null;
  }

  const revenueData = monthlyData.map((month, index) => ({
    x: index,
    y: month.revenue
  }));
  
  const expensesData = monthlyData.map((month, index) => ({
    x: index,
    y: month.expenses
  }));

  const revenueForecasts = linearRegressionForecast(revenueData, months);
  const expensesForecasts = linearRegressionForecast(expensesData, months);
  const predictions = [];
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const lastMonth = monthlyData[monthlyData.length - 1].month;
  const [lastMonthStr, lastYearStr] = lastMonth.split(' ');
  const lastMonthIndex = monthNames.indexOf(lastMonthStr);
  const lastYear = parseInt(lastYearStr);

  for (let i = 0; i < months; i++) {
    const revenue = revenueForecasts[i].y;
    const expenses = expensesForecasts[i].y;
    const profit = revenue - expenses;
    const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
    
    const nextMonthIndex = (lastMonthIndex + i + 1) % 12;
    const nextYear = lastYear + Math.floor((lastMonthIndex + i + 1) / 12);

    predictions.push({
      month: `${monthNames[nextMonthIndex]} ${nextYear}`,
      revenue,
      expenses,
      profit,
      profitMargin: parseFloat(profitMargin.toFixed(2)),
      forecasted: true
    });
  }

  return predictions;
};

module.exports = {
  linearRegressionForecast,
  movingAverageForecast,
  predictFinancialMetrics,
}; 