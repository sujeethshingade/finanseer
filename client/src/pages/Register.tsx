import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    useTheme,
    useMediaQuery,
    Paper,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterMutation } from '../services/api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { tokens } from '../theme';

const Register = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isNonMobile = useMediaQuery('(min-width: 600px)');
    const [register, { isLoading }] = useRegisterMutation();
    const [error, setError] = useState<string | null>(null);

    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [formErrors, setFormErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });

        // Clear error when typing
        if (formErrors[name as keyof typeof formErrors]) {
            setFormErrors({
                ...formErrors,
                [name]: '',
            });
        }
    };

    const validate = () => {
        let valid = true;
        const newErrors = { ...formErrors };

        if (!formValues.name) {
            newErrors.name = 'Name is required';
            valid = false;
        }

        if (!formValues.email) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
            newErrors.email = 'Email is invalid';
            valid = false;
        }

        if (!formValues.password) {
            newErrors.password = 'Password is required';
            valid = false;
        } else if (formValues.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            valid = false;
        }

        if (!formValues.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
            valid = false;
        } else if (formValues.password !== formValues.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            valid = false;
        }

        setFormErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            const { confirmPassword, ...userData } = formValues;
            console.log('Attempting to register with data:', userData);
            const response = await register(userData).unwrap();
            console.log('Registration response:', response);
            dispatch(setCredentials(response));
            navigate('/dashboard');
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.data?.message || err.error || 'An error occurred during registration');
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
                        Create an Account
                    </Typography>
                </Box>

                {error && (
                    <Typography color="error" sx={{ mb: '1rem', textAlign: 'center' }}>
                        {error}
                    </Typography>
                )}

                <form onSubmit={handleSubmit}>
                    <Box
                        display="grid"
                        gap="1.5rem"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    >
                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Name"
                            name="name"
                            value={formValues.name}
                            onChange={handleChange}
                            error={!!formErrors.name}
                            helperText={formErrors.name}
                            sx={{ gridColumn: 'span 4' }}
                        />
                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Email"
                            name="email"
                            value={formValues.email}
                            onChange={handleChange}
                            error={!!formErrors.email}
                            helperText={formErrors.email}
                            sx={{ gridColumn: 'span 4' }}
                        />
                        <TextField
                            fullWidth
                            variant="filled"
                            type="password"
                            label="Password"
                            name="password"
                            value={formValues.password}
                            onChange={handleChange}
                            error={!!formErrors.password}
                            helperText={formErrors.password}
                            sx={{ gridColumn: 'span 4' }}
                        />
                        <TextField
                            fullWidth
                            variant="filled"
                            type="password"
                            label="Confirm Password"
                            name="confirmPassword"
                            value={formValues.confirmPassword}
                            onChange={handleChange}
                            error={!!formErrors.confirmPassword}
                            helperText={formErrors.confirmPassword}
                            sx={{ gridColumn: 'span 4' }}
                        />
                    </Box>

                    <Box mt="2rem">
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            disabled={isLoading}
                            sx={{
                                bgcolor: colors.greenAccent[600],
                                color: colors.grey[100],
                                fontWeight: 'bold',
                                '&:hover': {
                                    bgcolor: colors.greenAccent[500],
                                },
                            }}
                        >
                            {isLoading ? 'Registering...' : 'Register'}
                        </Button>
                    </Box>
                </form>

                <Box mt="1.5rem" textAlign="center">
                    <Typography variant="body1" color={colors.grey[300]}>
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            style={{ color: colors.greenAccent[400], textDecoration: 'none' }}
                        >
                            Login here
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default Register; 