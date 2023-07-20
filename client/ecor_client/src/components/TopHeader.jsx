/* eslint-disable react-refresh/only-export-components */
import { memo, useEffect } from "react";
import { Link } from "react-router-dom";
import path from "../ultils/path";
import { getCurrentUsers } from "../store/users/UserActions";
import { useDispatch, useSelector } from "react-redux";
import icons from "../ultils/icon";
import { logout, clearMsg } from "../store/users/UserSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const TopHeader = () => {
  const { AiOutlineLogout } = icons;
  const dishpatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, current, msg } = useSelector((state) => state.user);
  const handleLogout = () => {
    dishpatch(logout());
    Swal.fire(`Congratulation`, `Đăng xuất thành công`, "success");
    navigate(`/${path.LOGIN}`);
  };
  useEffect(() => {
    const setTimeOutId = setTimeout(() => {
      if (isLoggedIn) dishpatch(getCurrentUsers());
    }, 300);
    return () => {
      clearTimeout(setTimeOutId);
    };
  }, [dishpatch, isLoggedIn]);
  useEffect(() => {
    if (msg) {
      Swal.fire("Oops!", msg, "info").then(() => {
        dishpatch(clearMsg());
        navigate(`/${path.LOGIN}`);
      });
    }
  }, [dishpatch, msg, navigate]);
  return (
    <>
      <div className="bg-main w-full h-[38px] flex items-center justify-center">
        <div className="w-main flex items-center justify-between text-sm text-white">
          <span>ORDER ONLINE OR CALL US (+1800) 000 8808</span>
          {isLoggedIn && current ? (
            <div className="flex gap-2 items-center text-sm">
              <small>
                {`Xin chào ${current?.firstName} ${current?.lastName}`}
              </small>
              <span
                onClick={handleLogout}
                className="hover:rounded-full bg-gray-200 p-2 hover:text-main cursor-pointer"
              >
                <AiOutlineLogout size={18} />
              </span>
            </div>
          ) : (
            <Link className="hover:text-gray-800" to={`${path.LOGIN}`}>
              Sign In or Create Account
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default memo(TopHeader);
