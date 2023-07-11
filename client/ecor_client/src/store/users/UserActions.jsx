import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../../api";
export const registerUser = createAsyncThunk(
  "users/register",
  async (data, { rejectWithValue }) => {
    const response = await apis.userRegister(data);
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response;
  }
);
