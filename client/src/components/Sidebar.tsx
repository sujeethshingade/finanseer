import {
    Box,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    useTheme,
} from '@mui/material';
import {
    ChevronLeft,
    ChevronRightOutlined,
    HomeOutlined,
    ShoppingCartOutlined,
    ReceiptLongOutlined,
    BarChartOutlined,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';
import { tokens } from '../theme';

interface SidebarProps {
    isNonMobile: boolean;
    drawerWidth: string;
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface NavItem {
    text: string;
    icon: JSX.Element;
    path: string;
    adminOnly?: boolean;
}

const navItems: NavItem[] = [
    {
        text: 'Dashboard',
        icon: <HomeOutlined />,
        path: '/dashboard',
    },
    {
        text: 'Products',
        icon: <ShoppingCartOutlined />,
        path: '/products',
    },
    {
        text: 'Transactions',
        icon: <ReceiptLongOutlined />,
        path: '/transactions',
    },
    {
        text: 'Predictions',
        icon: <BarChartOutlined />,
        path: '/predictions',
    },
];

const Sidebar = ({
    isNonMobile,
    drawerWidth,
    isSidebarOpen,
    setIsSidebarOpen,
}: SidebarProps) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const user = useSelector(selectCurrentUser);
    const isAdmin = user?.role === 'admin';

    return (
        <Box component="nav">
            {isSidebarOpen && (
                <Drawer
                    open={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    variant="persistent"
                    anchor="left"
                    sx={{
                        width: drawerWidth,
                        '& .MuiDrawer-paper': {
                            color: colors.grey[100],
                            backgroundColor: colors.primary[400],
                            boxSizing: 'border-box',
                            borderWidth: isNonMobile ? 0 : '2px',
                            width: drawerWidth,
                        },
                    }}
                >
                    <Box width="100%">
                        <Box m="1.5rem 2rem 2rem 3rem">
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box display="flex" alignItems="center" gap="0.5rem">
                                    <Typography variant="h4" fontWeight="bold">
                                        Finanseer
                                    </Typography>
                                </Box>
                                {!isNonMobile && (
                                    <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                                        <ChevronLeft />
                                    </IconButton>
                                )}
                            </Box>
                        </Box>
                        <List>
                            {navItems.map(({ text, icon, path, adminOnly }) => {
                                if (adminOnly && !isAdmin) return null;

                                const lcText = text.toLowerCase();
                                const active = pathname === path;

                                return (
                                    <ListItem key={text} disablePadding>
                                        <ListItemButton
                                            onClick={() => {
                                                navigate(path);
                                                if (!isNonMobile) setIsSidebarOpen(false);
                                            }}
                                            sx={{
                                                backgroundColor: active
                                                    ? colors.primary[300]
                                                    : 'transparent',
                                                color: active ? colors.primary[100] : colors.grey[100],
                                            }}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    ml: '2rem',
                                                    color: active ? colors.primary[100] : colors.grey[100],
                                                }}
                                            >
                                                {icon}
                                            </ListItemIcon>
                                            <ListItemText primary={text} />
                                            {active && (
                                                <ChevronRightOutlined sx={{ ml: 'auto' }} />
                                            )}
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>
                </Drawer>
            )}
        </Box>
    );
};

export default Sidebar; 