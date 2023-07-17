/* eslint-disable react-refresh/only-export-components */
import { memo } from "react";
import PropTypes from "prop-types";
const InputSelect = ({ value, changeValue, options }) => {
  return (
    <select
      className="form-select text-sm"
      value={value}
      onChange={(e) => changeValue(e.target.value)}
    >
      <option value="" disabled>
        -- Chọn sắp xếp theo --
      </option>
      {options?.map((el) => (
        <option key={el.id} value={el.value}>
          {el.text}
        </option>
      ))}
    </select>
  );
};
InputSelect.propTypes = {
  value: PropTypes.value,
  changeValue: PropTypes.func,
  options: PropTypes.array,
};
export default memo(InputSelect);
