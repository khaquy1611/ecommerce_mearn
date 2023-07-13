import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    current: null,
    token: null,
  },
  reducers: {
    login: (state, action) => {
      (state.isLoggedIn = action.payload.isLoggedIn),
        (state.current = action.payload.userData),
        (state.token = action.payload.token);
    },
  },
  //   extraReducers: (builder) => {
  //     builder.addCase(actions.registerUser.pending, (state) => {
  //       state.loading = true;
  //       state.error = null;
  //     });
  //     builder.addCase(actions.registerUser.fulfilled, (state, { payload, error }) => {
  //       state.loading = false;
  //       state.data = payload;
  //       state.error = error.message;
  //     });
  //     builder.addCase(
  //       actions.registerUser.rejected,
  //       (state, { payload, error }) => {
  //         state.loading = false;
  //         state.data = payload
  //         state.error = error.message;
  //       }
  //     );
  //   },
});
export const { login } = authSlice.actions;
export default authSlice.reducer;
