import { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    useTheme,
    Grid,
    Paper,
    CircularProgress,
    Alert,
    Tabs,
    Tab,
} from '@mui/material';
import Header from '../components/Header';
import { tokens } from '../theme';
import { useGetDashboardMetricsQuery } from '../services/api';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';

const linearRegressionForecast = (data: any[], periods: number, key: string) => {
    if (!data || data.length < 2) return [];

    const n = data.length;
    const xValues = Array.from({ length: n }, (_, i) => i);
    const yValues = data.map((d) => d[key]);

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
    const lastMonth = data[data.length - 1].month;
    const monthNumber = parseInt(lastMonth.split(' ')[1] || '0');

    for (let i = 1; i <= periods; i++) {
        const forecastedY = slope * (n + i - 1) + yIntercept;
        forecast.push({
            month: `Month ${monthNumber + i}`,
            [key]: Math.max(0, parseFloat(forecastedY.toFixed(2))),
            forecasted: true,
        });
    }

    return forecast;
};

const Predictions = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { data, error, isLoading } = useGetDashboardMetricsQuery({});
    const [forecastPeriods, setForecastPeriods] = useState(3);
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="80vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={2}>
                <Header title="Predictions" subtitle="Financial forecasting and analytics" />
                <Alert severity="error" sx={{ mt: 2 }}>
                    Failed to load data. Please try again later.
                </Alert>
            </Box>
        );
    }

    if (!data || !data.monthlyData || data.monthlyData.length < 3) {
        return (
            <Box p={2}>
                <Header title="Predictions" subtitle="Financial forecasting and analytics" />
                <Alert severity="warning" sx={{ mt: 2 }}>
                    Insufficient data for forecasting. Please add more transactions over time.
                </Alert>
            </Box>
        );
    }

    const monthlyData = [...data.monthlyData];
    const revenueForecasts = linearRegressionForecast(monthlyData, forecastPeriods, 'revenue');
    const expenseForecasts = linearRegressionForecast(monthlyData, forecastPeriods, 'expenses');

    const revenueChartData = [...monthlyData, ...revenueForecasts];
    const expenseChartData = [...monthlyData, ...expenseForecasts];

    const profitForecasts = revenueForecasts.map((rf, i) => ({
        month: rf.month,
        profit: Number(rf.revenue) - Number(expenseForecasts[i].expenses),
        forecasted: true,
    }));

    const profitChartData = [
        ...monthlyData.map(d => ({
            month: d.month,
            profit: d.revenue - d.expenses,
            forecasted: false,
        })),
        ...profitForecasts,
    ];

    const calculateRSquared = (data: any[], forecast: string) => {
        if (data.length < 5) return 0;

        const actual = data.slice(0, -3).map(d => d[forecast]);
        const predicted = data.slice(3).filter(d => !d.forecasted).map(d => d[forecast]);

        if (actual.length !== predicted.length) return 0;

        const mean = actual.reduce((a, b) => a + b, 0) / actual.length;

        const ssTotal = actual.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0);
        const ssResidual = actual.reduce((sum, value, i) => sum + Math.pow(value - predicted[i], 2), 0);

        return 1 - (ssResidual / ssTotal);
    };

    const revenueAccuracy = Math.min(100, Math.max(0, calculateRSquared(revenueChartData, 'revenue') * 100));
    const expenseAccuracy = Math.min(100, Math.max(0, calculateRSquared(expenseChartData, 'expenses') * 100));

    return (
        <Box p={2}>
            <Header title="Predictions" subtitle="Financial forecasting and analytics" />

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Forecast Horizon</Typography>
                <Box>
                    {[3, 6, 12].map((period) => (
                        <Button
                            key={period}
                            variant={forecastPeriods === period ? 'contained' : 'outlined'}
                            color="secondary"
                            sx={{ mx: 1 }}
                            onClick={() => setForecastPeriods(period)}
                        >
                            {period} months
                        </Button>
                    ))}
                </Box>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                >
                    <Tab label="Revenue Forecast" />
                    <Tab label="Expense Forecast" />
                    <Tab label="Profit Forecast" />
                </Tabs>
            </Box>

            {tabValue === 0 && (
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 400,
                                bgcolor: colors.primary[400],
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Revenue Forecast
                            </Typography>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={revenueChartData}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 30,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke={colors.grey[800]} />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fill: colors.grey[100] }}
                                        tickLine={{ stroke: colors.grey[100] }}
                                    />
                                    <YAxis
                                        tick={{ fill: colors.grey[100] }}
                                        tickLine={{ stroke: colors.grey[100] }}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip
                                        formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                                        contentStyle={{
                                            backgroundColor: colors.primary[500],
                                            color: colors.grey[100],
                                            border: `1px solid ${colors.grey[800]}`,
                                        }}
                                        labelStyle={{ fontWeight: 'bold' }}
                                    />
                                    <Legend />
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop
                                                offset="5%"
                                                stopColor={colors.greenAccent[500]}
                                                stopOpacity={0.8}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor={colors.greenAccent[500]}
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke={colors.greenAccent[500]}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                        dot={{ r: 5 }}
                                        activeDot={{ r: 8 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 400,
                                bgcolor: colors.primary[400],
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Revenue Insights
                            </Typography>
                            <Box p={2} display="flex" flexDirection="column" gap={2}>
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        Forecast Accuracy
                                    </Typography>
                                    <Typography variant="h4" color={colors.greenAccent[500]}>
                                        {revenueAccuracy.toFixed(1)}%
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        Projected Monthly Revenue
                                    </Typography>
                                    <Typography variant="h4" color={colors.greenAccent[500]}>
                                        {formatCurrency(Number(revenueForecasts[0]?.revenue || 0))}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        Growth Trend
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        color={
                                            revenueForecasts[forecastPeriods - 1]?.revenue > revenueForecasts[0]?.revenue
                                                ? colors.greenAccent[500]
                                                : colors.redAccent[500]
                                        }
                                    >
                                        {revenueForecasts[forecastPeriods - 1]?.revenue > revenueForecasts[0]?.revenue
                                            ? 'Positive'
                                            : 'Negative'}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        {forecastPeriods}-Month Projection
                                    </Typography>
                                    <Typography variant="h4" color={colors.greenAccent[500]}>
                                        {formatCurrency(
                                            revenueForecasts.reduce((sum, item) => sum + Number(item.revenue), 0)
                                        )}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {tabValue === 1 && (
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 400,
                                bgcolor: colors.primary[400],
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Expense Forecast
                            </Typography>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={expenseChartData}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 30,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke={colors.grey[800]} />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fill: colors.grey[100] }}
                                        tickLine={{ stroke: colors.grey[100] }}
                                    />
                                    <YAxis
                                        tick={{ fill: colors.grey[100] }}
                                        tickLine={{ stroke: colors.grey[100] }}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip
                                        formatter={(value) => [formatCurrency(Number(value)), 'Expenses']}
                                        contentStyle={{
                                            backgroundColor: colors.primary[500],
                                            color: colors.grey[100],
                                            border: `1px solid ${colors.grey[800]}`,
                                        }}
                                        labelStyle={{ fontWeight: 'bold' }}
                                    />
                                    <Legend />
                                    <defs>
                                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                            <stop
                                                offset="5%"
                                                stopColor={colors.redAccent[500]}
                                                stopOpacity={0.8}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor={colors.redAccent[500]}
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <Area
                                        type="monotone"
                                        dataKey="expenses"
                                        stroke={colors.redAccent[500]}
                                        fillOpacity={1}
                                        fill="url(#colorExpenses)"
                                        dot={{ r: 5 }}
                                        activeDot={{ r: 8 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 400,
                                bgcolor: colors.primary[400],
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Expense Insights
                            </Typography>
                            <Box p={2} display="flex" flexDirection="column" gap={2}>
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        Forecast Accuracy
                                    </Typography>
                                    <Typography variant="h4" color={colors.redAccent[500]}>
                                        {expenseAccuracy.toFixed(1)}%
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        Projected Monthly Expenses
                                    </Typography>
                                    <Typography variant="h4" color={colors.redAccent[500]}>
                                        {formatCurrency(Number(expenseForecasts[0]?.expenses || 0))}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        Trend
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        color={
                                            expenseForecasts[forecastPeriods - 1]?.expenses < expenseForecasts[0]?.expenses
                                                ? colors.greenAccent[500]
                                                : colors.redAccent[500]
                                        }
                                    >
                                        {expenseForecasts[forecastPeriods - 1]?.expenses < expenseForecasts[0]?.expenses
                                            ? 'Decreasing (Good)'
                                            : 'Increasing (Caution)'}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        {forecastPeriods}-Month Projection
                                    </Typography>
                                    <Typography variant="h4" color={colors.redAccent[500]}>
                                        {formatCurrency(
                                            expenseForecasts.reduce((sum, item) => sum + Number(item.expenses), 0)
                                        )}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {tabValue === 2 && (
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 400,
                                bgcolor: colors.primary[400],
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Profit Forecast
                            </Typography>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={profitChartData}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom:
                                            30,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke={colors.grey[800]} />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fill: colors.grey[100] }}
                                        tickLine={{ stroke: colors.grey[100] }}
                                    />
                                    <YAxis
                                        tick={{ fill: colors.grey[100] }}
                                        tickLine={{ stroke: colors.grey[100] }}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip
                                        formatter={(value) => [formatCurrency(Number(value)), 'Profit']}
                                        contentStyle={{
                                            backgroundColor: colors.primary[500],
                                            color: colors.grey[100],
                                            border: `1px solid ${colors.grey[800]}`,
                                        }}
                                        labelStyle={{ fontWeight: 'bold' }}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="profit"
                                        stroke={colors.blueAccent[500]}
                                        strokeWidth={2}
                                        dot={{ r: 5 }}
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 400,
                                bgcolor: colors.primary[400],
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Profit Insights
                            </Typography>
                            <Box p={2} display="flex" flexDirection="column" gap={2}>
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        Projected Monthly Profit
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        color={
                                            profitForecasts[0]?.profit > 0
                                                ? colors.greenAccent[500]
                                                : colors.redAccent[500]
                                        }
                                    >
                                        {formatCurrency(profitForecasts[0]?.profit || 0)}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        Trend
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        color={
                                            profitForecasts[forecastPeriods - 1]?.profit > profitForecasts[0]?.profit
                                                ? colors.greenAccent[500]
                                                : colors.redAccent[500]
                                        }
                                    >
                                        {profitForecasts[forecastPeriods - 1]?.profit > profitForecasts[0]?.profit
                                            ? 'Improving'
                                            : 'Declining'}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        {forecastPeriods}-Month Projection
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        color={
                                            profitForecasts.reduce((sum, item) => sum + item.profit, 0) > 0
                                                ? colors.greenAccent[500]
                                                : colors.redAccent[500]
                                        }
                                    >
                                        {formatCurrency(
                                            profitForecasts.reduce((sum, item) => sum + item.profit, 0)
                                        )}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        Financial Outlook
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        color={
                                            profitForecasts.every((item) => item.profit > 0)
                                                ? colors.greenAccent[500]
                                                : profitForecasts.every((item) => item.profit < 0)
                                                    ? colors.redAccent[500]
                                                    : colors.blueAccent[300]
                                        }
                                    >
                                        {profitForecasts.every((item) => item.profit > 0)
                                            ? 'Positive'
                                            : profitForecasts.every((item) => item.profit < 0)
                                                ? 'Negative'
                                                : 'Mixed'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default Predictions; 