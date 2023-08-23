import { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import icons from "../../ultils/icon";
import { Link } from "react-router-dom";
import path from "../../ultils/path";
import { useSelector, useDispatch,  } from "react-redux";
import { logout } from "../../store/users/UserSlice";
const Header = () => {
  const { current } = useSelector((state) => state.user);
  const [isShowOptions, setIsShowOptions] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const handleClickOutOptions = (e) => {
      const profile = document.getElementById(`profile`);
      if (!profile.contains(e.target)) setIsShowOptions(false);
    };
    document.addEventListener(`click`, handleClickOutOptions);
    return () => {
      document.removeEventListener(`click`, handleClickOutOptions);
    };
  }, []);
  const { RiPhoneFill, MdEmail, BsHandbagFill, FaUserCircle } = icons;
  return (
    <div className="w-main flex justify-between h-[110px] mx-auto py-[35px]">
      <Link to={`/${path.HOME}`}>
        <img src={logo} alt="logo" className="w-[234px] object-contain" />
      </Link>
      <div className="flex text-[13px]">
        <div className="flex flex-col items-center px-6 border-r">
          <span className="flex gap-4 items-center">
            <RiPhoneFill color="red" />
            <span className="font-semibold"> (+1800) 000 8808 </span>
          </span>
          <span>Mon-Sat 9:00AM - 8:00PM</span>
        </div>
        <div className="flex flex-col items-center px-6 border-r">
          <span className="flex gap-4 items-center">
            <MdEmail color="red" />
            <span className="font-semibold">SUPPORT@TADATHEMES.COM </span>
          </span>
          <span>Online Support 24/7</span>
        </div>
        {current && (
          <>
            <div className="cursor-pointer flex items-center justify-center gap-2 px-6 border-r">
              <BsHandbagFill color="red" />
              <span>0 items(0)</span>
            </div>
            <div
              className="cursor-pointer flex items-center justify-center px-6 gap-2 relative"
              onClick={() => setIsShowOptions(!isShowOptions)}
              id="profile"
            >
              <FaUserCircle color="red" />
              <span>Profile: </span>
              {isShowOptions && (
                <div 
                onClick={e => e.stopPropagation()}
                className="absolute top-full flex flex-col items-center left-0 bg-gray-100 border min-w-[150px] py-2"
                >
                  <Link
                    className="p-2 w-full hover:bg-sky-100"
                    to={`/${path.MEMBER}/${path.PERSONAL}`}
                  >
                    Person
                  </Link>
                  {+current.role === 0 && (
                    <Link
                      className="p-2 w-full hover:bg-sky-100"
                      to={`/${path.ADMIN}/${path.DASHBOARD}`}
                    >
                      Admin WorkSpace
                    </Link>
                  )}
                  <span
                    onClick={() => dispatch(logout())}
                    className="p-2 w-full hover:bg-sky-100"
                  >
                    Logout
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
