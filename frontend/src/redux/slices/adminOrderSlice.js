import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Async thunk action to fetch user orders (admin only)
export const fetchAdminOrders = createAsyncThunk(
  "admin/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/admin-orders`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to update order delivery status (admin only)
export const updateOrderDeliveryStatus = createAsyncThunk(
  "admin/updateOrderDeliveryStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/admin-orders/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to delete order details by ID (admin only)
export const deleteAdminOrder = createAsyncThunk(
  "admin/deleteOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/admin/admin-orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    totalOrders: 0,
    totalSales: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Handle fetchAdminOrders
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalOrders = action.payload.length;
        // calculate total sales
        const totalSales = action.payload.reduce(
          (total, order) => total + order.totalPrice,
          0
        );
        state.totalSales = totalSales;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Handle updateOrderDeliveryStatus
      .addCase(updateOrderDeliveryStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderDeliveryStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload;
        const orderIndex = state.orders.findIndex(
          (order) => order._id === updatedOrder._id
        );
        if (orderIndex !== -1) {
          state.orders[orderIndex] = updatedOrder;
        }
      })
      .addCase(updateOrderDeliveryStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle deleteAdminOrder
      .addCase(deleteAdminOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdminOrder.fulfilled, (state, action) => {
        state.loading = false;
        const deletedOrderId = action.payload._id;
        state.orders = state.orders.filter(
          (order) => order._id !== deletedOrderId
        );
        state.totalOrders = state.orders.length;
        // Recalculate total sales
        const totalSales = state.orders.reduce(
          (total, order) => total + order.totalPrice,
          0
        );
        state.totalSales = totalSales;
      })
      .addCase(deleteAdminOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {} = adminOrderSlice.actions;

export default adminOrderSlice.reducer;
