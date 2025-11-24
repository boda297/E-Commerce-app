import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//  Create checkout session
export const createCheckoutSession = createAsyncThunk(
  "checkout/createCheckout",
  async (checkoutdata, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");

      console.log("Sending checkout data:", checkoutdata);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/checkout/create-checkout-session`,
        checkoutdata,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Checkout error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkout: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.checkout = null;
      state.loading = false;
      state.error = null;
      // Clear checkout data from localStorage if exists
      localStorage.removeItem("checkout");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCheckoutSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckoutSession.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
      })
      .addCase(createCheckoutSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart } = checkoutSlice.actions;
export default checkoutSlice.reducer;
