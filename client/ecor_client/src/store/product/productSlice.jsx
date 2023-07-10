import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./productActions";

console.log('actions', actions.getProducts);
export const productsSlice = createSlice({
  name: "products",
  initialState: {
    newProducts: [],
    isLoading: false,
    errorMessage: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(actions.getProductsActions.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(actions.getProductsActions.fulfilled, (state, action) => {
      state.isLoading = true;
      state.newProducts = action.payload;
    });
    builder.addCase(actions.getProductsActions.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload.msg;
    });
  },
});

export default productsSlice.reducer;
