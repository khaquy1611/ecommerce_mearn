/* eslint-disable react-refresh/only-export-components */
import { useState, memo } from "react";
import { productInfoTabs } from "../ultils/contains";

const ProductInfomation = () => {
  const [activedTab, setActivedTab] = useState(1);
  return (
    <div>
      <div className="flex items-center gap-2 relative bottom-[-1px]">
        {productInfoTabs.map((el) => (
          <span
            className={`p-2 px-4 cursor-pointer ${
              activedTab === +el.id
                ? "bg-white border border-b-0"
                : "bg-gray-200"
            }`}
            key={el.id}
            onClick={() => setActivedTab(el.id)}
          >
            {el.name}
          </span>
        ))}
      </div>
      <div className="w-full border p-4">
        {productInfoTabs.some((el) => el.id === activedTab) &&
          productInfoTabs.find((el) => el.id === activedTab)?.content}
      </div>
    </div>
  );
};

export default memo(ProductInfomation);
