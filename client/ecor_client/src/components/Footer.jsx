/* eslint-disable react-refresh/only-export-components */
import { memo } from "react";
import icons from "../ultils/icon";
const Footer = () => {
  const { MdEmail } = icons;
  return (
    <div className="w-full">
      <div className="h-[103px] w-full bg-main flex items-center justify-center">
        <div className="w-main flex items-center justify-between">
          <div className="flex flex-col flex-1">
            <span className="text-[20px] text-gray-100">
              SIGN UP TO NEWSLETTER
            </span>
            <span className="text-[13px] text-gray-300">
              Subcribe now and revice weekly newssletter
            </span>
          </div>
          <div className="flex-1 flex items-center">
            <input
              type="text"
              name=""
              placeholder="Email address..."
              id=""
              className="placeholder:italic placeholder:opacity-50 p-4 pr-0 rounded-l-full flex-1 bg-[#F04646] outline-none text-gray-100 placeholder:text-sm placeholder:text-gray-100"
            />
          </div>
          <div className="h-[56px] w-[56px] bg-[#F04646] rounded-r-full flex items-center justify-center text-white">
            <MdEmail size={16} />
          </div>
        </div>
      </div>
      <div className="h-[407px] w-full bg-gray-900 flex items-center justify-center text-white text-[13px]">
        <div className="w-main flex">
          <div className="flex-2 flex flex-col gap-2">
            <h3 className="mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]">
              ABOUT US
            </h3>
            <span>
              <span>Address: </span>
              <span className="opacity-70">
                474 Ontario St Toronto, ON M4X 1M7 Canadâ
              </span>
            </span>
            <span>
              <span>Phone: </span>
              <span className="opacity-70">4(+1234)56789xxx</span>
            </span>
            <span>
              <span>Mail: </span>
              <span className="opacity-70">4(+1234)56789xxx</span>
            </span>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <h3 className="mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]">
              Infomation
            </h3>
            <span>Typography</span>
            <span>Gallerry</span>
            <span>Store Location</span>
            <span>Today is Deal</span>
            <span>Contacts</span>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <h3 className="mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]">
              WHO WE ARE
            </h3>
            <span>HELP</span>
            <span>Free Shipping</span>
            <span>FAQS</span>
            <span>Return && Exchange</span>
            <span>Testmonials</span>
          </div>
          <div className="flex-1">
            <h3 className="mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]">
              #DIGITALWORLDSTORE
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Footer);
