/* eslint-disable react-refresh/only-export-components */
import { memo } from "react";
import avartar from "../../assets/avartar.png";
import moment from "moment";
import { renderStartFromNumber } from "../../ultils/helper";
import PropTypes from "prop-types";

const Comment = ({
  image = avartar,
  name = "Anonymours",
  updatedAt,
  comment,
  star,
}) => {
  return (
    <div className="flex">
      <div className="p-4 flex-none">
        <img
          src={image}
          alt="avatarr"
          className="w-[25px]  h-[25px] object-cover rounded-full"
        />
      </div>
      <div className="flex flex-col flex-auto">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">{name}</h3>
          <span className="text-xs italic">{moment(updatedAt)?.fromNow()}</span>
        </div>
        <div className="flex flex-col gap-2 pl-4 text-sm mt-4 border py-2 bg-gray-100 border-gray-300">
          <span className="flex items-center gap-1">
            <span className="font-semibold">Đánh giá:</span>
            <span className="flex items-center gap-1">
              {renderStartFromNumber(star)?.map((el, index) => (
                <span key={index}>{el}</span>
              ))}
            </span>
          </span>

          <span className="flex gap-1">
            <span className="font-semibold">Bình luận:</span>
            <span className="flex items-center gap-1">{comment}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
Comment.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string,
  updatedAt: PropTypes.string,
  comment: PropTypes.string,
  star: PropTypes.number,
};
export default memo(Comment);
