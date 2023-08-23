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
import {
  AdminLayout,
  ManageOrder,
  ManageProduct,
  ManageUser,
  CreateProduct,
  DashBoard,
} from "./pages/admin";
import { 
  MemberLayout, 
  Personal, 
  History,
  MyCart,
  Wishlist
} from "./pages/member";
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
        {/* ADMIN SITE */}
        <Route path={path.ADMIN} element={<AdminLayout />}>
          <Route path={path.DASHBOARD} element={<DashBoard />}></Route>
          <Route path={path.MANAGE_ORDER} element={<ManageOrder />}></Route>
          <Route
            path={path.MANAGE_PRODUCTS}
            element={<ManageProduct />}
          ></Route>
          <Route path={path.MANAGE_USER} element={<ManageUser />}></Route>
          <Route
            path={path.CREATE_PRODUCTS}
            element={<CreateProduct />}
          ></Route>
        </Route>
        {/* MEMBER SITE */}
        <Route path={path.MEMBER} element={<MemberLayout />}>
          <Route path={path.PERSONAL} element={<Personal />}></Route>
          <Route path={path.MY_CART} element={<MyCart id='cart' />}></Route>
          <Route path={path.WISHLIST} element={<Wishlist />}></Route>
          <Route path={path.HISTORY} element={<History />}></Route>
        </Route>
        <Route path={path.FINAL_REGISTER} element={<FinalRegister />}></Route>
        <Route path={path.LOGIN} element={<Login />}></Route>
        <Route path={path.ALL} element={<Home />}></Route>
      </Routes>
      <Toast />
    </div>
  );
}

export default App;
