import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../../api";
export const getProducts = createAsyncThunk(
  "app/fetchProducts",
  async (data, { rejectWithValue }) => {
    const response = await apis.getProducts(data);
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response.productData;
  }
);
