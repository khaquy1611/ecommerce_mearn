/* eslint-disable react-refresh/only-export-components */
import { useState, memo } from "react";
import { productInfoTabs } from "../ultils/contains";
import { VoteBar } from "../components";
import { renderStartFromNumber } from "../ultils/helper";
import PropTypes from "prop-types";

const ProductInfomation = ({ totalRatings, totalCount }) => {
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
        {activedTab === 5 && (
          <div className="flex p-4">
            <div className="flex-4 border flex flex-col border-red-500 items-center justify-center">
              <span className="flex font-semibold text-3xl">{`${totalRatings}/5`}</span>
              <span className="flex items-center gap-1">{renderStartFromNumber(totalRatings)?.map((el, index) => (
                <span key={index}>{el}</span>
              ))}</span>
              <span className="text-sm">{`${totalCount} reviewers and comments`}</span>
            </div>
            <div className="flex-6 border flex flex-col p-4 gap-2">
              {Array.from(Array(5).keys())
                .reverse()
                .map((el) => (
                  <VoteBar
                    key={el}
                    number={el + 1}
                    ratingsCount={2}
                    ratingsTotal={5}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
ProductInfomation.propTypes = {
  totalRatings: PropTypes.number,
  totalCount:  PropTypes.number
};
export default memo(ProductInfomation);
