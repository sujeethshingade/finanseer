import { Box, Button, Container, Typography, useTheme, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../theme';
import { motion } from 'framer-motion';
import {
    AccountBalance,
    TrendingUp,
    Analytics,
    Security,
    Speed,
    Insights
} from '@mui/icons-material';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const LandingPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();

    const features = [
        {
            icon: <AccountBalance sx={{ fontSize: 40, color: colors.greenAccent[500] }} />,
            title: "Smart Budgeting",
            description: "Create and manage budgets with AI-powered insights and recommendations"
        },
        {
            icon: <TrendingUp sx={{ fontSize: 40, color: colors.greenAccent[500] }} />,
            title: "Investment Tracking",
            description: "Monitor your investments and get real-time market analysis"
        },
        {
            icon: <Analytics sx={{ fontSize: 40, color: colors.greenAccent[500] }} />,
            title: "Expense Analytics",
            description: "Detailed analytics and visualizations of your spending patterns"
        },
        {
            icon: <Security sx={{ fontSize: 40, color: colors.greenAccent[500] }} />,
            title: "Secure Platform",
            description: "Bank-level security to protect your financial data"
        },
        {
            icon: <Speed sx={{ fontSize: 40, color: colors.greenAccent[500] }} />,
            title: "Real-time Updates",
            description: "Get instant notifications and updates on your financial activities"
        },
        {
            icon: <Insights sx={{ fontSize: 40, color: colors.greenAccent[500] }} />,
            title: "Smart Predictions",
            description: "AI-powered predictions for future financial trends and opportunities"
        }
    ];

    const steps = [
        {
            title: "Sign Up",
            description: "Create your account and set up your financial profile"
        },
        {
            title: "Update Details",
            description: "Update your details of transactions and preferences"
        },
        {
            title: "Get Insights",
            description: "Receive AI-powered insights and recommendations"
        },
        {
            title: "Track Progress",
            description: "Monitor your financial goals and track your progress"
        }
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: colors.primary[500],
            }}
        >
            {/* Hero Section */}
            <MotionBox
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    py: 8,
                    px: 2,
                }}
            >
                <Container maxWidth="md">
                    <MotionTypography
                        variants={fadeIn}
                        variant="h1"
                        sx={{
                            color: colors.grey[100],
                            mb: 4,
                            fontWeight: 'bold',
                            fontSize: { xs: '2.5rem', md: '4rem' },
                        }}
                    >
                        Welcome to Finanseer
                    </MotionTypography>
                    <MotionTypography
                        variants={fadeIn}
                        variant="h4"
                        sx={{
                            color: colors.grey[300],
                            mb: 6,
                            fontSize: { xs: '1.2rem', md: '1.5rem' },
                        }}
                    >
                        Your intelligent financial companion for smarter money management
                    </MotionTypography>
                    <MotionBox
                        variants={fadeIn}
                        sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}
                    >
                        <MotionButton
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/login')}
                            sx={{
                                backgroundColor: colors.greenAccent[500],
                                '&:hover': {
                                    backgroundColor: colors.greenAccent[600],
                                },
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem',
                            }}
                        >
                            Login
                        </MotionButton>
                        <MotionButton
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/register')}
                            sx={{
                                borderColor: colors.greenAccent[500],
                                color: colors.greenAccent[500],
                                '&:hover': {
                                    borderColor: colors.greenAccent[600],
                                    backgroundColor: 'rgba(104, 112, 250, 0.1)',
                                },
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem',
                            }}
                        >
                            Register
                        </MotionButton>
                    </MotionBox>
                </Container>
            </MotionBox>

            {/* Features Section */}
            <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                sx={{
                    py: 8,
                    px: 2,
                    backgroundColor: colors.primary[500],
                }}
            >
                <Container maxWidth="lg">
                    <MotionTypography
                        variants={fadeIn}
                        variant="h2"
                        sx={{
                            color: colors.grey[100],
                            mb: 6,
                            textAlign: 'center',
                            fontSize: { xs: '2rem', md: '3rem' },
                        }}
                    >
                        Powerful Features
                    </MotionTypography>
                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <MotionBox
                                    variants={fadeIn}
                                    whileHover={{ scale: 1.05 }}
                                    component={Paper}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        backgroundColor: colors.primary[500],
                                        borderRadius: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                    }}
                                >
                                    {feature.icon}
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            color: colors.grey[100],
                                            mt: 2,
                                            mb: 1,
                                        }}
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: colors.grey[300],
                                        }}
                                    >
                                        {feature.description}
                                    </Typography>
                                </MotionBox>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </MotionBox>

            {/* How It Works Section */}
            <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                sx={{
                    py: 8,
                    px: 2,
                    backgroundColor: colors.primary[500],
                }}
            >
                <Container maxWidth="lg">
                    <MotionTypography
                        variants={fadeIn}
                        variant="h2"
                        sx={{
                            color: colors.grey[100],
                            mb: 6,
                            textAlign: 'center',
                            fontSize: { xs: '2rem', md: '3rem' },
                        }}
                    >
                        How It Works
                    </MotionTypography>
                    <Grid container spacing={4}>
                        {steps.map((step, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <MotionBox
                                    variants={fadeIn}
                                    whileHover={{ scale: 1.05 }}
                                    component={Paper}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        backgroundColor: colors.primary[500],
                                        borderRadius: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        position: 'relative',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            right: '-20px',
                                            top: '50%',
                                            width: '40px',
                                            height: '2px',
                                            backgroundColor: colors.greenAccent[500],
                                            display: index === steps.length - 1 ? 'none' : { xs: 'none', md: 'block' },
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: colors.greenAccent[500],
                                            mb: 1,
                                        }}
                                    >
                                        Step {index + 1}
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            color: colors.grey[100],
                                            mb: 2,
                                        }}
                                    >
                                        {step.title}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: colors.grey[300],
                                        }}
                                    >
                                        {step.description}
                                    </Typography>
                                </MotionBox>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </MotionBox>

            {/* Footer */}
            <Box
                component="footer"
                sx={{
                    py: 3,
                    px: 2,
                    mt: 'auto',
                    backgroundColor: colors.primary[500],
                    color: colors.grey[100],
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="body2" sx={{ textAlign: 'center' }}>
                        © {new Date().getFullYear()} Finanseer. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default LandingPage; 