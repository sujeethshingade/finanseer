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
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { DataGrid, GridToolbar, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Header from '../components/Header';
import { tokens } from '../theme';
import {
    useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} from '../services/api';

interface ProductFormData {
    name: string;
    category: string;
    price: string;
    quantity: string;
    sku: string;
    description: string;
}

const Products = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { data: products, isLoading, error, refetch } = useGetProductsQuery({});
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

    // Modal state
    const [open, setOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
    const [currentProductId, setCurrentProductId] = useState<string | null>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertSeverity, setAlertSeverity] = useState<'error' | 'success'>('error');

    // Form state
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        category: '',
        price: '',
        quantity: '',
        sku: '',
        description: '',
    });

    const handleOpen = (mode: 'create' | 'edit', productId?: string) => {
        setDialogMode(mode);
        setCurrentProductId(productId || null);
        setAlertMessage(null);

        if (mode === 'create') {
            setFormData({
                name: '',
                category: '',
                price: '',
                quantity: '',
                sku: '',
                description: '',
            });
        } else if (mode === 'edit' && productId) {
            const product = products?.find((p: any) => p._id === productId);
            if (product) {
                setFormData({
                    name: product.name,
                    category: product.category,
                    price: product.price.toString(),
                    quantity: product.quantity.toString(),
                    sku: product.sku,
                    description: product.description || '',
                });
            }
        }

        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const productData = {
                name: formData.name,
                category: formData.category,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity),
                sku: formData.sku,
                description: formData.description,
            };

            if (dialogMode === 'create') {
                await createProduct(productData).unwrap();
                setAlertMessage('Product created successfully');
                setAlertSeverity('success');
                setTimeout(() => {
                    handleClose();
                    refetch();
                }, 1500);
            } else if (dialogMode === 'edit' && currentProductId) {
                await updateProduct({
                    id: currentProductId,
                    ...productData,
                }).unwrap();
                setAlertMessage('Product updated successfully');
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
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id).unwrap();
                refetch();
            } catch (err: any) {
                alert(err.data?.message || 'An error occurred while deleting the product');
            }
        }
    };

    const columns: GridColDef[] = [
        { field: '_id', headerName: 'ID', flex: 0.5 },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'category', headerName: 'Category', flex: 1 },
        {
            field: 'price',
            headerName: 'Price',
            flex: 0.5,
            renderCell: (params) => (
                <Typography>
                    ${params.value.toFixed(2)}
                </Typography>
            ),
        },
        { field: 'quantity', headerName: 'Quantity', flex: 0.5 },
        { field: 'sku', headerName: 'SKU', flex: 0.75 },
        { field: 'description', headerName: 'Description', flex: 1.5 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
                <Box display="flex" justifyContent="center" gap={2}>
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
                        disabled={isDeleting}
                    >
                        Delete
                    </Button>
                </Box>
            ),
        },
    ];

    return (
        <Box p={2}>
            <Header title="Products" subtitle="Managing your product inventory" />

            <Box display="flex" justifyContent="end" mt="20px" mb="20px">
                <Button
                    color="secondary"
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen('create')}
                >
                    Add Product
                </Button>
            </Box>

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
                        Failed to load products. Please try again later.
                    </Typography>
                ) : (
                    <DataGrid
                        rows={products}
                        columns={columns}
                        components={{ Toolbar: GridToolbar }}
                        getRowId={(row) => row._id}
                        disableRowSelectionOnClick
                    />
                )}
            </Box>

            {/* Add/Edit Dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    {dialogMode === 'create' ? 'Add New Product' : 'Edit Product'}
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
                            autoFocus
                            name="name"
                            label="Product Name"
                            type="text"
                            fullWidth
                            value={formData.name}
                            onChange={handleChange}
                            required
                            sx={{ gridColumn: 'span 2' }}
                        />
                        <TextField
                            name="category"
                            label="Category"
                            type="text"
                            fullWidth
                            value={formData.category}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            name="sku"
                            label="SKU"
                            type="text"
                            fullWidth
                            value={formData.sku}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            name="price"
                            label="Price"
                            type="number"
                            fullWidth
                            value={formData.price}
                            onChange={handleChange}
                            required
                            inputProps={{ step: 0.01, min: 0 }}
                        />
                        <TextField
                            name="quantity"
                            label="Quantity"
                            type="number"
                            fullWidth
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            inputProps={{ step: 1, min: 0 }}
                        />
                        <TextField
                            name="description"
                            label="Description"
                            type="text"
                            fullWidth
                            value={formData.description}
                            onChange={handleChange}
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

export default Products;

