import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../features/store';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      // Get token from state
      const token = (getState() as RootState).auth.token;
      
      // Add authorization header if token exists
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['User', 'KPI', 'Product', 'Transaction'],
  endpoints: (builder) => ({
    // User endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/user/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/user/register',
        method: 'POST',
        body: userData,
      }),
    }),
    getProfile: builder.query({
      query: () => '/user/profile',
      providesTags: ['User'],
    }),

    // KPI endpoints
    getDashboardMetrics: builder.query({
      query: () => '/kpi/dashboard',
      providesTags: ['KPI'],
    }),

    // Products endpoints
    getProducts: builder.query({
      query: () => '/product',
      providesTags: ['Product'],
    }),
    getProduct: builder.query({
      query: (id) => `/product/${id}`,
      providesTags: ['Product'],
    }),
    createProduct: builder.mutation({
      query: (product) => ({
        url: '/product',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/product/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    getProductAnalytics: builder.query({
      query: () => '/product/analytics',
      providesTags: ['Product'],
    }),

    // Transactions endpoints
    getTransactions: builder.query({
      query: (filters) => ({
        url: '/transaction',
        params: { ...filters },
      }),
      providesTags: ['Transaction'],
    }),
    getTransaction: builder.query({
      query: (id) => `/transaction/${id}`,
      providesTags: ['Transaction'],
    }),
    createTransaction: builder.mutation({
      query: (transaction) => ({
        url: '/transaction',
        method: 'POST',
        body: transaction,
      }),
      invalidatesTags: ['Transaction', 'KPI'],
    }),
    updateTransaction: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/transaction/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['Transaction'],
    }),
    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `/transaction/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Transaction'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useGetDashboardMetricsQuery,
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductAnalyticsQuery,
  useGetTransactionsQuery,
  useGetTransactionQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = api; 