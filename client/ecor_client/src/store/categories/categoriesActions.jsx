import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../../api";
export const getCategories = createAsyncThunk(
  "app/fetchCategories",
  async (data, { rejectWithValue  }) => {
    const response = await apis.getCategories();
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response.productCategoriesData;
  }
);
