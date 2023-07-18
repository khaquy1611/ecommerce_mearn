import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import {
  Home,
  Login,
  Public,
  FAQS,
  Services,
  DetailProducts,
  Product,
  Blogs,
  FinalRegister,
  ResetPassWord,
} from "./pages/public";
import path from "./ultils/path";
import { getCategories } from "./store/categories/categoriesActions";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "./components";
import { Modal } from "./components";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();
  const { isShowModal, modalShowChildren } = useSelector(
    (state) => state.categoriesReducer
  );
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);
  return (
    <div className="font-main relative">
      {isShowModal && <Modal>{modalShowChildren}</Modal>}
      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />}></Route>
          <Route path={path.FAQS} element={<FAQS />}></Route>
          <Route path={path.SERVICES} element={<Services />}></Route>
          <Route path={path.PRODUCT} element={<Product />}></Route>
          <Route
            path={path.DETAIL_PRODUCTS_CATEGORY_PID_TITLE}
            element={<DetailProducts />}
          ></Route>
          <Route path={path.BLOG} element={<Blogs />}></Route>
          <Route path={path.RESET_PASSWORD} element={<ResetPassWord />}></Route>
        </Route>
        <Route path={path.FINAL_REGISTER} element={<FinalRegister />}></Route>
        <Route path={path.LOGIN} element={<Login />}></Route>
      </Routes>
      <Toast />
    </div>
  );
}

export default App;
