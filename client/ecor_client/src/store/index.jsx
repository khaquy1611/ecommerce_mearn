import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "./categories/categoriesSlice";
import productReducer from "./product/productSlice";
import logger from "redux-logger";
import { batchedSubscribe } from "redux-batched-subscribe";
import { debounce } from "lodash";

const debounceNotify = debounce((notify) => notify());
export const store = configureStore({
  reducer: {
    categoriesReducer,
    productReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  enhancers: [batchedSubscribe(debounceNotify)],
});
