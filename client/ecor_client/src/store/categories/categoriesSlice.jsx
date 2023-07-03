import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./categoriesActions";
export const appSlice = createSlice({
  name: "app",
  initialState: {
    categories: [],
    isLoading: false,
    errorMessage: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(actions.getCategories.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(actions.getCategories.fulfilled, (state, action) => {
      state.isLoading = true;
      state.categories = action.payload;
    });
    builder.addCase(actions.getCategories.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });
  },
});

export default appSlice.reducer;
