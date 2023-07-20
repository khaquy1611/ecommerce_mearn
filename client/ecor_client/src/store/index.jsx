/* eslint-disable react-refresh/only-export-components */
import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "./categories/categoriesSlice";
import productReducer from "./product/productSlice";
import authReducer from "./users/UserSlice";
import logger from "redux-logger";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { batchedSubscribe } from "redux-batched-subscribe";
import { debounce } from "lodash";

const commonConfig = {
  key: "shop/user",
  storage,
};

const userConfig = {
  ...commonConfig,
  whitelist: ["isLoggedIn", "token", "current"],
};

const debounceNotify = debounce((notify) => notify());
export const store = configureStore({
  reducer: {
    categoriesReducer,
    productReducer,
    user: persistReducer(userConfig, authReducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logger),
  enhancers: [batchedSubscribe(debounceNotify)],
});

export const persistor = persistStore(store);
