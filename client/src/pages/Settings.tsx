import { useState } from 'react';
import {
    Box,
    Typography,
    useTheme,
    FormControlLabel,
    Switch,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Divider,
    Paper,
    Grid,
    Avatar,
    IconButton,
    Alert,
    Snackbar,
    SelectChangeEvent,
} from '@mui/material';
import { LightMode, DarkMode, Save, PhotoCamera } from '@mui/icons-material';
import { tokens } from '../theme';
import Header from '../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { setMode } from '../features/theme/themeSlice';
import { selectCurrentUser } from '../features/auth/authSlice';

const Settings = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Profile settings
    const [profileSettings, setProfileSettings] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Alert settings
    const [alertSettings, setAlertSettings] = useState({
        lowProfitMargin: true,
        lowInventory: true,
        highExpenses: true,
        profitMarginThreshold: '15',
        inventoryThreshold: '10',
        expenseThreshold: '5000',
    });

    // Display settings
    const [displaySettings, setDisplaySettings] = useState({
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        refreshInterval: '30',
    });

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileSettings((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAlertToggle = (setting: string) => {
        setAlertSettings((prev) => ({
            ...prev,
            [setting]: !prev[setting as keyof typeof alertSettings],
        }));
    };

    const handleAlertInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAlertSettings((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDisplayChange = (
        e: SelectChangeEvent | React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setDisplaySettings((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const saveSettings = (section: string) => {
        // In a real app, make API calls to save these settings
        setSnackbarMessage(`${section} settings saved successfully`);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box p={2}>
            <Header title="Settings" subtitle="Manage your application preferences" />

            <Grid container spacing={3}>
                {/* Profile Settings */}
                <Grid item xs={12}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            bgcolor: colors.primary[400],
                            borderRadius: '10px',
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h4">Profile Settings</Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<Save />}
                                onClick={() => saveSettings('Profile')}
                            >
                                Save Changes
                            </Button>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={2}>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Avatar
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            bgcolor: colors.greenAccent[500],
                                            mb: 1,
                                        }}
                                    >
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </Avatar>
                                    <IconButton
                                        color="primary"
                                        aria-label="upload picture"
                                        component="label"
                                    >
                                        <input hidden accept="image/*" type="file" />
                                        <PhotoCamera />
                                    </IconButton>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={10}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            label="Name"
                                            name="name"
                                            value={profileSettings.name}
                                            onChange={handleProfileChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            label="Email"
                                            name="email"
                                            value={profileSettings.email}
                                            onChange={handleProfileChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                                            Change Password
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            label="Current Password"
                                            name="currentPassword"
                                            type="password"
                                            value={profileSettings.currentPassword}
                                            onChange={handleProfileChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            label="New Password"
                                            name="newPassword"
                                            type="password"
                                            value={profileSettings.newPassword}
                                            onChange={handleProfileChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            label="Confirm New Password"
                                            name="confirmPassword"
                                            type="password"
                                            value={profileSettings.confirmPassword}
                                            onChange={handleProfileChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Theme Settings */}
                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            bgcolor: colors.primary[400],
                            borderRadius: '10px',
                            height: '100%',
                        }}
                    >
                        <Typography variant="h4" mb={2}>
                            Theme Settings
                        </Typography>

                        <Divider sx={{ mb: 3 }} />

                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            p={2}
                            borderRadius="5px"
                            bgcolor={colors.primary[600]}
                        >
                            <Box display="flex" alignItems="center">
                                {theme.palette.mode === 'dark' ? (
                                    <DarkMode sx={{ mr: 2, color: colors.grey[300] }} />
                                ) : (
                                    <LightMode sx={{ mr: 2, color: colors.grey[300] }} />
                                )}
                                <Typography variant="h5">
                                    {theme.palette.mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
                                </Typography>
                            </Box>
                            <Switch
                                checked={theme.palette.mode === 'dark'}
                                onChange={() => dispatch(setMode())}
                            />
                        </Box>

                        <Typography variant="body1" mt={2} color={colors.grey[300]}>
                            Toggle between dark and light mode for the application.
                        </Typography>
                    </Paper>
                </Grid>

                {/* Alert Settings */}
                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            bgcolor: colors.primary[400],
                            borderRadius: '10px',
                            height: '100%',
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h4">Alert Settings</Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<Save />}
                                onClick={() => saveSettings('Alert')}
                            >
                                Save
                            </Button>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Box>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                mb={2}
                            >
                                <Box>
                                    <Typography variant="h6">Low Profit Margin Alert</Typography>
                                    <Typography variant="body2" color={colors.grey[300]}>
                                        Get notified when profit margin falls below threshold
                                    </Typography>
                                </Box>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={alertSettings.lowProfitMargin}
                                            onChange={() => handleAlertToggle('lowProfitMargin')}
                                        />
                                    }
                                    label=""
                                />
                            </Box>

                            <TextField
                                fullWidth
                                variant="filled"
                                label="Profit Margin Threshold (%)"
                                name="profitMarginThreshold"
                                type="number"
                                value={alertSettings.profitMarginThreshold}
                                onChange={handleAlertInputChange}
                                disabled={!alertSettings.lowProfitMargin}
                                sx={{ mb: 3 }}
                            />

                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                mb={2}
                            >
                                <Box>
                                    <Typography variant="h6">Low Inventory Alert</Typography>
                                    <Typography variant="body2" color={colors.grey[300]}>
                                        Get notified when inventory items are running low
                                    </Typography>
                                </Box>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={alertSettings.lowInventory}
                                            onChange={() => handleAlertToggle('lowInventory')}
                                        />
                                    }
                                    label=""
                                />
                            </Box>

                            <TextField
                                fullWidth
                                variant="filled"
                                label="Inventory Threshold (items)"
                                name="inventoryThreshold"
                                type="number"
                                value={alertSettings.inventoryThreshold}
                                onChange={handleAlertInputChange}
                                disabled={!alertSettings.lowInventory}
                                sx={{ mb: 3 }}
                            />

                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                mb={2}
                            >
                                <Box>
                                    <Typography variant="h6">High Expenses Alert</Typography>
                                    <Typography variant="body2" color={colors.grey[300]}>
                                        Get notified when expenses exceed threshold
                                    </Typography>
                                </Box>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={alertSettings.highExpenses}
                                            onChange={() => handleAlertToggle('highExpenses')}
                                        />
                                    }
                                    label=""
                                />
                            </Box>

                            <TextField
                                fullWidth
                                variant="filled"
                                label="Expense Threshold ($)"
                                name="expenseThreshold"
                                type="number"
                                value={alertSettings.expenseThreshold}
                                onChange={handleAlertInputChange}
                                disabled={!alertSettings.highExpenses}
                            />
                        </Box>
                    </Paper>
                </Grid>

                {/* Display Settings */}
                <Grid item xs={12}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            bgcolor: colors.primary[400],
                            borderRadius: '10px',
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h4">Display Settings</Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<Save />}
                                onClick={() => saveSettings('Display')}
                            >
                                Save
                            </Button>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth variant="filled">
                                    <InputLabel>Currency</InputLabel>
                                    <Select
                                        name="currency"
                                        value={displaySettings.currency}
                                        onChange={handleDisplayChange}
                                        label="Currency"
                                    >
                                        <MenuItem value="USD">USD ($)</MenuItem>
                                        <MenuItem value="EUR">EUR (€)</MenuItem>
                                        <MenuItem value="GBP">GBP (£)</MenuItem>
                                        <MenuItem value="JPY">JPY (¥)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth variant="filled">
                                    <InputLabel>Date Format</InputLabel>
                                    <Select
                                        name="dateFormat"
                                        value={displaySettings.dateFormat}
                                        onChange={handleDisplayChange}
                                        label="Date Format"
                                    >
                                        <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                                        <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                                        <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth variant="filled">
                                    <InputLabel>Data Refresh Interval</InputLabel>
                                    <Select
                                        name="refreshInterval"
                                        value={displaySettings.refreshInterval}
                                        onChange={handleDisplayChange}
                                        label="Data Refresh Interval"
                                    >
                                        <MenuItem value="0">Manual Refresh Only</MenuItem>
                                        <MenuItem value="30">Every 30 seconds</MenuItem>
                                        <MenuItem value="60">Every minute</MenuItem>
                                        <MenuItem value="300">Every 5 minutes</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Settings; 