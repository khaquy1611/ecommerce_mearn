/* eslint-disable react-refresh/only-export-components */
import { memo } from "react";
import PropTypes from "prop-types";
const SelectQuantity = ({ quantity, handleQuantity, handleChangeQuantity }) => {
  return (
    <div className="flex items-center">
      <span
        onClick={() => handleChangeQuantity("-")}
        className="p-2 border-r border-black"
      >
        -
      </span>
      <input
        className="py-2 text-center outline-none w-[30px]"
        type="text"
        value={quantity}
        onChange={(e) => handleQuantity(e.target.value)}
      />
      <span
        onClick={() => handleChangeQuantity("+")}
        className="p-2 border-l border-black"
      >
        +
      </span>
    </div>
  );
};

SelectQuantity.propTypes = {
  quantity: PropTypes.number,
  handleQuantity: PropTypes.func,
  handleChangeQuantity: PropTypes.func,
};
export default memo(SelectQuantity);
