import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "./categories/categoriesSlice";
export const store = configureStore({
  reducer: {
    categoriesReducer,
  },
});
