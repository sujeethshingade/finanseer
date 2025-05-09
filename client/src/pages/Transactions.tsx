import { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    useTheme,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    CircularProgress,
    Alert,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    FilterAlt as FilterAltIcon,
} from '@mui/icons-material';
import { DataGrid, GridToolbar, GridColDef } from '@mui/x-data-grid';
import Header from '../components/Header';
import { tokens } from '../theme';
import {
    useGetTransactionsQuery,
    useGetProductsQuery,
    useCreateTransactionMutation,
    useUpdateTransactionMutation,
    useDeleteTransactionMutation,
} from '../services/api';

interface TransactionFormData {
    amount: string;
    type: string;
    category: string;
    productId: string;
    status: string;
    paymentMethod: string;
    description: string;
}

interface FilterData {
    startDate: Date | null;
    endDate: Date | null;
    status: string;
    paymentMethod: string;
}

const Transactions = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Filters
    const [filters, setFilters] = useState<FilterData>({
        startDate: null,
        endDate: null,
        status: '',
        paymentMethod: '',
    });
    const [showFilters, setShowFilters] = useState(false);

    // Query state
    const { data: transactions, isLoading, error, refetch } = useGetTransactionsQuery(
        {
            startDate: filters.startDate?.toISOString(),
            endDate: filters.endDate?.toISOString(),
            status: filters.status || undefined,
            paymentMethod: filters.paymentMethod || undefined,
        }
    );
    const { data: products } = useGetProductsQuery({});
    const [createTransaction, { isLoading: isCreating }] = useCreateTransactionMutation();
    const [updateTransaction, { isLoading: isUpdating }] = useUpdateTransactionMutation();
    const [deleteTransaction] = useDeleteTransactionMutation();

    // Modal state
    const [open, setOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
    const [currentTransactionId, setCurrentTransactionId] = useState<string | null>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertSeverity, setAlertSeverity] = useState<'error' | 'success'>('error');

    // Form state
    const [formData, setFormData] = useState<TransactionFormData>({
        amount: '',
        type: 'income',
        category: '',
        productId: '',
        status: 'completed',
        paymentMethod: 'cash',
        description: '',
    });

    const handleFilterChange = (event: SelectChangeEvent | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDateChange = (field: 'startDate' | 'endDate', date: Date | null) => {
        setFilters((prev) => ({
            ...prev,
            [field]: date,
        }));
    };

    const resetFilters = () => {
        setFilters({
            startDate: null,
            endDate: null,
            status: '',
            paymentMethod: '',
        });
    };

    const handleOpen = (mode: 'create' | 'edit', transactionId?: string) => {
        setDialogMode(mode);
        setCurrentTransactionId(transactionId || null);
        setAlertMessage(null);

        if (mode === 'create') {
            setFormData({
                amount: '',
                type: 'income',
                category: '',
                productId: '',
                status: 'completed',
                paymentMethod: 'cash',
                description: '',
            });
        } else if (mode === 'edit' && transactionId) {
            const transaction = transactions?.find((t: any) => t._id === transactionId);
            if (transaction) {
                setFormData({
                    amount: transaction.amount.toString(),
                    type: transaction.type,
                    category: transaction.category,
                    productId: transaction.productId || '',
                    status: transaction.status,
                    paymentMethod: transaction.paymentMethod,
                    description: transaction.description || '',
                });
            }
        }

        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const transactionData = {
                amount: parseFloat(formData.amount),
                type: formData.type,
                category: formData.category,
                productId: formData.productId || undefined,
                status: formData.status,
                paymentMethod: formData.paymentMethod,
                description: formData.description,
            };

            if (dialogMode === 'create') {
                await createTransaction(transactionData).unwrap();
                setAlertMessage('Transaction created successfully');
                setAlertSeverity('success');
                setTimeout(() => {
                    handleClose();
                    refetch();
                }, 1500);
            } else if (dialogMode === 'edit' && currentTransactionId) {
                await updateTransaction({
                    id: currentTransactionId,
                    ...transactionData,
                }).unwrap();
                setAlertMessage('Transaction updated successfully');
                setAlertSeverity('success');
                setTimeout(() => {
                    handleClose();
                    refetch();
                }, 1500);
            }
        } catch (err: any) {
            setAlertMessage(err.data?.message || 'An error occurred');
            setAlertSeverity('error');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await deleteTransaction(id).unwrap();
                refetch();
            } catch (err: any) {
                alert(err.data?.message || 'An error occurred while deleting the transaction');
            }
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const columns: GridColDef[] = [
        { field: '_id', headerName: 'ID', flex: 0.5 },
        {
            field: 'date',
            headerName: 'Date',
            flex: 1,
            valueGetter: (params) => new Date(params.row.createdAt),
            renderCell: (params) => (
                <Typography>
                    {new Date(params.row.createdAt).toLocaleDateString()}
                </Typography>
            ),
        },
        {
            field: 'amount',
            headerName: 'Amount',
            flex: 1,
            renderCell: (params) => (
                <Typography
                    color={
                        params.row.type === 'income'
                            ? colors.greenAccent[500]
                            : colors.redAccent[500]
                    }
                    fontWeight="bold"
                >
                    {params.row.type === 'income' ? '+' : '-'}
                    {formatCurrency(params.value)}
                </Typography>
            ),
        },
        { field: 'type', headerName: 'Type', flex: 0.75 },
        { field: 'category', headerName: 'Category', flex: 1 },
        {
            field: 'productId',
            headerName: 'Product',
            flex: 1,
            renderCell: (params) => (
                <Typography>
                    {params.value
                        ? products?.find((p: any) => p._id === params.value)?.name || 'Unknown'
                        : 'N/A'}
                </Typography>
            ),
        },
        { field: 'status', headerName: 'Status', flex: 0.75 },
        { field: 'paymentMethod', headerName: 'Payment Method', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
                <Box display="flex" justifyContent="center" gap={1}>
                    <Button
                        onClick={() => handleOpen('edit', params.row._id)}
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => handleDelete(params.row._id)}
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                    >
                        Delete
                    </Button>
                </Box>
            ),
        },
    ];

    return (
        <Box p={2}>
            <Header title="Transactions" subtitle="View and manage your financial transactions" />

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt="20px"
                mb="20px"
            >
                <Button
                    variant="outlined"
                    startIcon={<FilterAltIcon />}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
                <Button
                    color="secondary"
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen('create')}
                >
                    Add Transaction
                </Button>
            </Box>

            {/* Filters */}
            {showFilters && (
                <Box
                    bgcolor={colors.primary[400]}
                    p={2}
                    borderRadius="4px"
                    mb={2}
                >
                    <Typography variant="h6" mb={2}>
                        Filters
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6} md={2.5}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Start Date"
                                    value={filters.startDate}
                                    onChange={(date: Date | null) => handleDateChange('startDate', date)}
                                    slotProps={{ textField: { fullWidth: true, variant: 'filled' } }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.5}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="End Date"
                                    value={filters.endDate}
                                    onChange={(date: Date | null) => handleDateChange('endDate', date)}
                                    slotProps={{ textField: { fullWidth: true, variant: 'filled' } }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.5}>
                            <FormControl fullWidth variant="filled">
                                <InputLabel>Status</InputLabel>
                                <Select
                                    name="status"
                                    value={filters.status}
                                    onChange={handleFilterChange}
                                >
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="completed">Completed</MenuItem>
                                    <MenuItem value="failed">Failed</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.5}>
                            <FormControl fullWidth variant="filled">
                                <InputLabel>Payment Method</InputLabel>
                                <Select
                                    name="paymentMethod"
                                    value={filters.paymentMethod}
                                    onChange={handleFilterChange}
                                >
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="cash">Cash</MenuItem>
                                    <MenuItem value="credit">Credit</MenuItem>
                                    <MenuItem value="debit">Debit</MenuItem>
                                    <MenuItem value="bank transfer">Bank Transfer</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                onClick={resetFilters}
                            >
                                Reset
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {/* DATAGRID */}
            <Box
                height="75vh"
                sx={{
                    '& .MuiDataGrid-root': {
                        border: 'none',
                    },
                    '& .MuiDataGrid-cell': {
                        borderBottom: `1px solid ${colors.grey[800]}`,
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: 'none',
                    },
                    '& .MuiDataGrid-virtualScroller': {
                        backgroundColor: colors.primary[400],
                    },
                    '& .MuiDataGrid-footerContainer': {
                        borderTop: 'none',
                        backgroundColor: colors.blueAccent[700],
                    },
                    '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
                        color: `${colors.grey[100]} !important`,
                    },
                }}
            >
                {isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error" variant="h5" sx={{ mt: 2 }}>
                        Failed to load transactions. Please try again later.
                    </Typography>
                ) : (
                    <DataGrid
                        rows={transactions}
                        columns={columns}
                        components={{ Toolbar: GridToolbar }}
                        getRowId={(row) => row._id}
                        disableRowSelectionOnClick
                    />
                )}
            </Box>

            {/* Add/Edit Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    {dialogMode === 'create' ? 'Add New Transaction' : 'Edit Transaction'}
                </DialogTitle>
                <DialogContent>
                    {alertMessage && (
                        <Alert severity={alertSeverity} sx={{ mb: 2 }}>
                            {alertMessage}
                        </Alert>
                    )}
                    <Box
                        component="form"
                        sx={{
                            display: 'grid',
                            gap: 2,
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            mt: 1,
                        }}
                    >
                        <TextField
                            name="amount"
                            label="Amount"
                            type="number"
                            fullWidth
                            value={formData.amount}
                            onChange={handleChange as React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>}
                            required
                            inputProps={{ step: 0.01, min: 0 }}
                        />
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Type</InputLabel>
                            <Select name="type" value={formData.type} onChange={handleChange} label="Type">
                                <MenuItem value="income">Income</MenuItem>
                                <MenuItem value="expense">Expense</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            name="category"
                            label="Category"
                            type="text"
                            fullWidth
                            value={formData.category}
                            onChange={handleChange as React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>}
                            required
                        />
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Product (Optional)</InputLabel>
                            <Select
                                name="productId"
                                value={formData.productId}
                                onChange={handleChange}
                                label="Product (Optional)"
                            >
                                <MenuItem value="">None</MenuItem>
                                {products?.map((product: any) => (
                                    <MenuItem key={product._id} value={product._id}>
                                        {product.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                label="Status"
                            >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="failed">Failed</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Payment Method</InputLabel>
                            <Select
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                label="Payment Method"
                            >
                                <MenuItem value="cash">Cash</MenuItem>
                                <MenuItem value="credit">Credit</MenuItem>
                                <MenuItem value="debit">Debit</MenuItem>
                                <MenuItem value="bank transfer">Bank Transfer</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            name="description"
                            label="Description"
                            type="text"
                            fullWidth
                            value={formData.description}
                            onChange={handleChange as React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>}
                            multiline
                            rows={4}
                            sx={{ gridColumn: 'span 2' }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isCreating || isUpdating}
                        color="secondary"
                    >
                        {isCreating || isUpdating ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Transactions; 