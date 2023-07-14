import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../../api";
export const getCurrentUsers = createAsyncThunk(
  "users/getCurrentUsers",
  async (data, { rejectWithValue }) => {
    const response = await apis.userGetCurrent();
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response?.userData;
  }
);

export const Logout = createAsyncThunk(
  "users/usersLogout",
  async (data, { rejectWithValue }) => {
    const response = await apis.userLogout();
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response?.msg;
  }
);
