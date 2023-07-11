/* eslint-disable react-refresh/only-export-components */
import { memo } from "react";
import PropTypes from "prop-types";
const Button = ({
  name,
  handleOnclick,
  style,
  iconsBefore,
  iconsAfter,
  fw,
}) => {
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
        handleOnclick && handleOnclick();
      }}
    >
      {iconsBefore}
      <span>{name}</span>
      {iconsAfter}
    </button>
  );
};
Button.propTypes = {
  name: PropTypes.string,
  handleOnclick: PropTypes.func,
  style: PropTypes.string,
  iconsBefore: PropTypes.element,
  iconsAfter: PropTypes.element,
  fw: PropTypes.bool,
};
export default memo(Button);
