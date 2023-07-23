/* eslint-disable react-refresh/only-export-components */
import { memo } from "react";
import PropTypes from "prop-types";
const Button = ({ children, handleOnClick, style, fw }) => {
  return (
    <button
      type="button"
      className={
        style
          ? style
          : `px-4 py-2 rounded-md text-white bg-main text-semibold my-2 ${
              fw ? "w-full" : "w-fit"
            }`
      }
      onClick={() => {
        handleOnClick && handleOnClick();
      }}
    >
      {children}
    </button>
  );
};
Button.propTypes = {
  children: PropTypes.isReqired,
  handleOnClick: PropTypes.func,
  style: PropTypes.string,
  fw: PropTypes.bool,
};
export default memo(Button);
