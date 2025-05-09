import { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    useTheme,
    Grid,
    Paper,
    CircularProgress,
} from '@mui/material';
import {
    AttachMoney,
    MoneyOffCsred,
    AccountBalanceWallet,
    TrendingUp,
} from '@mui/icons-material';
import Header from '../components/Header';
import StatBox from '../components/StatBox';
import { useGetDashboardMetricsQuery } from '../services/api';
import { tokens } from '../theme';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
} from 'recharts';

const Dashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { data, error, isLoading } = useGetDashboardMetricsQuery();

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
                <Header title="Dashboard" subtitle="Financial overview and KPIs" />
                <Typography color="error" variant="h5" sx={{ mt: 2 }}>
                    Failed to load dashboard data. Please try again later.
                </Typography>
            </Box>
        );
    }

    if (!data) {
        return (
            <Box p={2}>
                <Header title="Dashboard" subtitle="Financial overview and KPIs" />
                <Typography variant="h5" sx={{ mt: 2 }}>
                    No data found. Please add transactions to start tracking your financials.
                </Typography>
            </Box>
        );
    }

    // Prepare chart data
    const monthlyData = data.monthlyData || [];
    const expenseCategories = data.expensesByCategory || {};

    // Format data for pie chart
    const pieChartData = Object.entries(expenseCategories).map(([name, value]) => ({
        name,
        value: Number(value),
    }));

    // Colors for pie chart
    const EXPENSE_COLORS = [
        colors.greenAccent[500],
        colors.blueAccent[500],
        colors.redAccent[500],
        colors.greenAccent[300],
        colors.blueAccent[300],
    ];

    return (
        <Box p={2}>
            <Header title="Dashboard" subtitle="Financial overview and KPIs" />

            {/* KPI GRID */}
            <Grid container spacing={2} sx={{ mt: 1 }}>
                {/* REVENUE */}
                <Grid item xs={12} sm={6} md={3}>
                    <StatBox
                        title="Total Revenue"
                        value={formatCurrency(data.totalRevenue || 0)}
                        increase="+14% from last month"
                        icon={<AttachMoney sx={{ color: colors.greenAccent[600], fontSize: 26 }} />}
                        description="Since last month"
                    />
                </Grid>

                {/* EXPENSES */}
                <Grid item xs={12} sm={6} md={3}>
                    <StatBox
                        title="Total Expenses"
                        value={formatCurrency(data.totalExpenses || 0)}
                        increase="+5% from last month"
                        icon={<MoneyOffCsred sx={{ color: colors.redAccent[500], fontSize: 26 }} />}
                        description="Since last month"
                    />
                </Grid>

                {/* PROFIT */}
                <Grid item xs={12} sm={6} md={3}>
                    <StatBox
                        title="Total Profit"
                        value={formatCurrency(data.totalProfit || 0)}
                        increase="+21% from last month"
                        icon={<AccountBalanceWallet sx={{ color: colors.blueAccent[500], fontSize: 26 }} />}
                        description="Since last month"
                    />
                </Grid>

                {/* PROFIT MARGIN */}
                <Grid item xs={12} sm={6} md={3}>
                    <StatBox
                        title="Profit Margin"
                        value={`${data.profitMargin || 0}%`}
                        increase="+12% from last month"
                        icon={<TrendingUp sx={{ color: colors.greenAccent[600], fontSize: 26 }} />}
                        description="Since last month"
                    />
                </Grid>
            </Grid>

            {/* CHARTS */}
            <Grid container spacing={2} sx={{ mt: 1 }}>
                {/* REVENUE & EXPENSES CHART */}
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
                        <Typography variant="h6" gutterBottom component="div">
                            Revenue & Expenses Trend
                        </Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={monthlyData}
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
                                    formatter={(value) => [`$${value}`, null]}
                                    contentStyle={{
                                        backgroundColor: colors.primary[500],
                                        color: colors.grey[100],
                                        border: `1px solid ${colors.grey[800]}`
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke={colors.greenAccent[500]}
                                    activeDot={{ r: 8 }}
                                    strokeWidth={2}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="expenses"
                                    stroke={colors.redAccent[500]}
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* EXPENSE BREAKDOWN */}
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
                        <Typography variant="h6" gutterBottom component="div">
                            Expense Breakdown
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => [`$${value}`, null]}
                                    contentStyle={{
                                        backgroundColor: colors.primary[500],
                                        color: colors.grey[100],
                                        border: `1px solid ${colors.grey[800]}`
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* RECENT TRANSACTIONS */}
                <Grid item xs={12}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            bgcolor: colors.primary[400],
                        }}
                    >
                        <Typography variant="h6" gutterBottom component="div">
                            Recent Transactions
                        </Typography>
                        {data.recentTransactions && data.recentTransactions.length > 0 ? (
                            <Box sx={{ mt: 1 }}>
                                {data.recentTransactions.map((transaction) => (
                                    <Box
                                        key={transaction._id}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            p: 1,
                                            borderBottom: `1px solid ${colors.grey[800]}`,
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="body1">
                                                {transaction.productId?.name || transaction.category}
                                            </Typography>
                                            <Typography variant="body2" color={colors.grey[300]}>
                                                {new Date(transaction.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="body1"
                                            color={
                                                transaction.type === 'income'
                                                    ? colors.greenAccent[500]
                                                    : colors.redAccent[500]
                                            }
                                            fontWeight="bold"
                                        >
                                            {transaction.type === 'income' ? '+' : '-'}
                                            {formatCurrency(transaction.amount)}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Typography variant="body1" sx={{ mt: 1 }}>
                                No recent transactions found.
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard; 