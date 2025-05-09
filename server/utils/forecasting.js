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

  // Calculate the slope and intercept for linear regression
  const n = data.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += data[i].x;
    sumY += data[i].y;
    sumXY += data[i].x * data[i].y;
    sumX2 += data[i].x ** 2;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
  const intercept = (sumY - slope * sumX) / n;

  // Generate forecasted values
  const lastX = data[n - 1].x;
  const forecast = [];

  for (let i = 1; i <= periods; i++) {
    const x = lastX + i;
    const y = slope * x + intercept;
    forecast.push({ x, y: Math.max(0, parseFloat(y.toFixed(2))) });
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

  // Calculate initial moving average
  let sum = 0;
  for (let i = n - periods; i < n; i++) {
    sum += data[i];
  }
  let movingAvg = sum / periods;

  // Generate forecasted values
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

  // Prepare data for forecasting
  const revenueData = monthlyData.map((month, index) => ({ 
    x: index, 
    y: month.revenue 
  }));
  
  const expensesData = monthlyData.map((month, index) => ({ 
    x: index, 
    y: month.expenses 
  }));

  // Forecast revenue and expenses
  const revenueForecasts = linearRegressionForecast(revenueData, months);
  const expensesForecasts = linearRegressionForecast(expensesData, months);

  // Generate predicted results
  const predictions = [];
  
  for (let i = 0; i < months; i++) {
    const revenue = revenueForecasts[i].y;
    const expenses = expensesForecasts[i].y;
    const profit = revenue - expenses;
    const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
    
    predictions.push({
      month: `Month ${monthlyData.length + i + 1}`,
      revenue,
      expenses,
      profit,
      profitMargin: parseFloat(profitMargin.toFixed(2)),
    });
  }

  return predictions;
};

module.exports = {
  linearRegressionForecast,
  movingAverageForecast,
  predictFinancialMetrics,
}; 