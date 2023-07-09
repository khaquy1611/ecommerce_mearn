/* eslint-disable react-refresh/only-export-components */
import { memo } from "react";
import PropTypes from 'prop-types';
const CountDown = ({ unit, number }) => {
  return (
    <div className="w-[30%] h-[60px] border flex flex-col justify-center items-center bg-gray-100 rounded-sm">
      <span className="text-[18px] text-gray-800">{number}</span>
      <span className="text-xs text-gray-700">{unit}</span>
    </div>
  );
};
CountDown.propTypes = {
    unit:  PropTypes.string.isRequired,
    number: PropTypes.number.isRequired
}
export default memo(CountDown);
