import {
    Box,
    Button,
    TextField,
    Typography,
    useTheme,
    useMediaQuery,
    Paper,
} from '@mui/material';
import { Formik, Form, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';
import { tokens } from '../theme';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginMutation } from '../services/api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';

interface LoginValues {
    email: string;
    password: string;
}

const loginSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Required'),
    password: yup.string().required('Required'),
});

const initialValues: LoginValues = {
    email: '',
    password: '',
};

const Login = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isNonMobile = useMediaQuery('(min-width: 600px)');
    const [login, { isLoading }] = useLoginMutation();
    const [error, setError] = useState<string | null>(null);

    const handleFormSubmit = async (
        values: LoginValues,
        { setSubmitting }: FormikHelpers<LoginValues>
    ) => {
        try {
            const userData = await login(values).unwrap();
            dispatch(setCredentials(userData));
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.data?.message || 'An error occurred during login');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor={colors.primary[500]}
        >
            <Paper
                elevation={3}
                sx={{
                    p: '2rem',
                    borderRadius: '1rem',
                    width: isNonMobile ? '400px' : '300px',
                }}
            >
                <Box textAlign="center" mb="2rem">
                    <Typography variant="h2" fontWeight="bold" color={colors.grey[100]}>
                        Finanseer
                    </Typography>
                    <Typography variant="h5" color={colors.grey[300]}>
                        Financial Analytics Dashboard
                    </Typography>
                </Box>

                {error && (
                    <Typography color="error" sx={{ mb: '1rem', textAlign: 'center' }}>
                        {error}
                    </Typography>
                )}

                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={loginSchema}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                    }) => (
                        <Form onSubmit={handleSubmit}>
                            <Box
                                display="grid"
                                gap="1.5rem"
                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            >
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Email"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.email}
                                    name="email"
                                    error={!!touched.email && !!errors.email}
                                    helperText={touched.email && errors.email}
                                    sx={{ gridColumn: 'span 4' }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="password"
                                    label="Password"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.password}
                                    name="password"
                                    error={!!touched.password && !!errors.password}
                                    helperText={touched.password && errors.password}
                                    sx={{ gridColumn: 'span 4' }}
                                />
                            </Box>

                            <Box mt="2rem">
                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting || isLoading}
                                    sx={{
                                        bgcolor: colors.greenAccent[600],
                                        color: colors.grey[100],
                                        fontWeight: 'bold',
                                        '&:hover': {
                                            bgcolor: colors.greenAccent[500],
                                        },
                                    }}
                                >
                                    {isSubmitting || isLoading ? 'Logging in...' : 'Login'}
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>

                <Box mt="1.5rem" textAlign="center">
                    <Typography variant="body1" color={colors.grey[300]}>
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            style={{ color: colors.greenAccent[400], textDecoration: 'none' }}
                        >
                            Register here
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default Login; 