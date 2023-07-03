import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Home, Login, Public } from "./pages/public";
import path from "./ultils/path";
import { getCategories } from "./store/categories/categoriesActions";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);
  return (
    <div className="min-h-screen font-main">
      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />}></Route>
          <Route path={path.LOGIN} element={<Login />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
