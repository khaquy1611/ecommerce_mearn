import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { store, persistor }  from "./store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from 'redux-persist/lib/integration/react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
      <PersistGate loading={<div>Loding...</div>} persistor={persistor}>
        <App />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
