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
      state.current = null;
      state.isLoading = false;
      state.msg = "";
    },
    clearMsg: (state) => {
      state.msg = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(actions.getCurrentUsers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(actions.getCurrentUsers.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.current = payload;
      state.isLoggedIn = true;
    });
    builder.addCase(actions.getCurrentUsers.rejected, (state) => {
      state.isLoading = false;
      state.current = null;
      state.isLoggedIn = false;
      state.token = null;
      state.msg = `Phiên đăng nhập đã hết hạn hãy đăng nhập lại`;
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
export const { login, logout, clearMsg } = authSlice.actions;
export default authSlice.reducer;
