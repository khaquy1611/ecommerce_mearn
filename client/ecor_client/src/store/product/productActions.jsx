import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../../api";
export const getProductsActions = createAsyncThunk(
  "app/getNewProducts",
  async (data, { rejectWithValue }) => {
    const response = await apis.getProducts({ sort: "-createdAt" });
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response.productData;
  }
);
