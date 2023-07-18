import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./categoriesActions";
export const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    isLoading: false,
    errorMessage: "",
    isShowModal: false,
    modalShowChildren: null,
  },
  reducers: {
    showModal: (state, action) => {
      state.isShowModal = action.payload.isShowModal;
      state.modalShowChildren = action.payload.modalShowChildren;
    }
  },
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
export const { showModal } = categoriesSlice.actions;
export default categoriesSlice.reducer;
