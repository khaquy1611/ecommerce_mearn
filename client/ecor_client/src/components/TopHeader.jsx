/* eslint-disable react-refresh/only-export-components */
import { memo } from "react";
import { Link } from "react-router-dom";
import path from "../ultils/path";
const TopHeader = () => {
  return (
    <>
      <div className="bg-main w-full h-[38px] flex items-center justify-center">
        <div className="w-main flex items-center justify-between text-sm text-white p-4">
          <span>ORDER ONLINE OR CALL US (+1800) 000 8808</span>
          <Link to={`${path.LOGIN}`}>Sign In or Create Account</Link>
        </div>
      </div>
    </>
  );
};

export default memo(TopHeader);
