import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./productActions";

console.log('actions', actions.getProducts);
export const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    isLoading: false,
    errorMessage: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(actions.getProducts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(actions.getProducts.fulfilled, (state, action) => {
      state.isLoading = true;
      state.products = action.payload;
    });
    builder.addCase(actions.getProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload.msg;
    });
  },
});

export default productsSlice.reducer;
