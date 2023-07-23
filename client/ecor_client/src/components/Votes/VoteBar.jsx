/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { memo, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import icons from "../../ultils/icon";

const VoteBar = ({ number, ratingsCount, ratingsTotal }) => {
  const { AiFillStar } = icons;
  const percentRef = useRef();
  useEffect(() => {
    const percent = Math.round((ratingsCount * 100) / ratingsTotal) || 0;
    percentRef.current.style.cssText = `right:${100 - percent}%`;
  }, [ratingsCount, ratingsTotal]);
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <div className="flex items-center justify-center text-sm gap-1">
        <span>{number}</span>
        <AiFillStar color="orange" />
      </div>
      <div className="w-[75%]">
        <div className="w-full h-[6px] relative bg-gray-200 rounded-l-full rounded-r-full">
          <div ref={percentRef} className="absolute inset-0 bg-red-500"></div>
        </div>
      </div>
      <div className="w-[15%] flex-2 flex justify-end text-xs text-400">
        {`${ratingsCount || 0} reviewers`}
      </div>
    </div>
  );
};

VoteBar.propTypes = {
  number: PropTypes.number,
  ratingsCount: PropTypes.number,
  ratingsTotal: PropTypes.number,
};
export default memo(VoteBar);
