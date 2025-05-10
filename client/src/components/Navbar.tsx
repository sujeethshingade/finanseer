import {
    AppBar,
    Avatar,
    Box,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    useTheme,
} from '@mui/material';
import {
    Menu as MenuIcon,
    DarkMode,
    LightMode,
    NotificationsOutlined,
    SettingsOutlined,
    ArrowDropDownOutlined,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setMode } from '../features/theme/themeSlice';
import { logout, selectCurrentUser } from '../features/auth/authSlice';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../theme';

interface NavbarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }: NavbarProps) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const user = useSelector(selectCurrentUser);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isOpen = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <AppBar
            sx={{
                position: 'static',
                background: 'none',
                boxShadow: 'none',
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                {/* LEFT SIDE */}
                <Box display="flex" alignItems="center">
                    <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h4" fontWeight="bold" color={colors.grey[100]}>
                        Finanseer
                    </Typography>
                </Box>

                {/* RIGHT SIDE */}
                <Box display="flex" alignItems="center" gap="1rem">
                    <IconButton onClick={() => dispatch(setMode())}>
                        {theme.palette.mode === 'dark' ? (
                            <LightMode sx={{ color: colors.grey[100], fontSize: '25px' }} />
                        ) : (
                            <DarkMode sx={{ fontSize: '25px' }} />
                        )}
                    </IconButton>
                    <IconButton>
                        <NotificationsOutlined
                            sx={{ color: colors.grey[100], fontSize: '25px' }}
                        />
                    </IconButton>
                    <IconButton onClick={() => navigate('/settings')}>
                        <SettingsOutlined
                            sx={{ color: colors.grey[100], fontSize: '25px' }}
                        />
                    </IconButton>

                    <Box display="flex" alignItems="center">
                        <Button
                            onClick={handleClick}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                textTransform: 'none',
                                gap: '1rem',
                            }}
                        >
                            <Avatar
                                src=""
                                alt="Profile"
                                sx={{ width: 32, height: 32 }}
                            />
                            <Box textAlign="left">
                                <Typography
                                    fontWeight="bold"
                                    fontSize="0.85rem"
                                    color={colors.grey[100]}
                                >
                                    {user?.name || 'User'}
                                </Typography>
                                <Typography fontSize="0.75rem" color={colors.grey[200]}>
                                    {user?.role || 'Role'}
                                </Typography>
                            </Box>
                            <ArrowDropDownOutlined
                                sx={{ color: colors.grey[100], fontSize: '25px' }}
                            />
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={isOpen}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                        >
                            <MenuItem onClick={() => {
                                handleClose();
                                navigate('/settings');
                            }}>
                                Settings
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 