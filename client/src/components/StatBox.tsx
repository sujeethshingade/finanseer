import { Box, Typography, useTheme } from '@mui/material';
import { tokens } from '../theme';
import React from 'react';

interface StatBoxProps {
    title: string;
    value: string | number;
    increase: string;
    icon: React.ReactNode;
    description: string;
}

const StatBox = ({ title, value, increase, icon, description }: StatBoxProps) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box
            gridColumn="span 2"
            gridRow="span 1"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            p="1.25rem 1rem"
            flex="1 1 100%"
            bgcolor={colors.primary[400]}
            borderRadius="0.55rem"
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: colors.grey[100] }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="h3"
                        fontWeight="bold"
                        sx={{ color: colors.greenAccent[500] }}
                    >
                        {value}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        bgcolor: colors.greenAccent[600],
                        p: '0.5rem',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {icon}
                </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
                    {increase}
                </Typography>
                <Typography
                    variant="h6"
                    fontStyle="italic"
                    sx={{ color: colors.grey[300] }}
                >
                    {description}
                </Typography>
            </Box>
        </Box>
    );
};

export default StatBox; 