import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./UserActions";
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    current: null,
    token: null,
    isLoading: false,
    msg: "",
  },
  reducers: {
    login: (state, action) => {
      (state.isLoggedIn = action.payload.isLoggedIn),
        (state.token = action.payload.token);
    },
    logout: (state) => {
      (state.isLoggedIn = false), (state.token = null);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(actions.getCurrentUsers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(actions.getCurrentUsers.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.current = payload;
    });
    builder.addCase(actions.getCurrentUsers.rejected, (state) => {
      state.isLoading = false;
      state.current = null;
    });

    builder.addCase(actions.Logout.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(actions.Logout.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.msg = payload;
    });
    builder.addCase(actions.Logout.rejected, (state, { error }) => {
      state.isLoading = false;
      state.msg = error;
    });
  },
});
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
