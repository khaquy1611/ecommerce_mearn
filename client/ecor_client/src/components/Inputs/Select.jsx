/* eslint-disable react-refresh/only-export-components */
import { memo } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
const Select = ({
  label,
  options = [],
  register,
  errors,
  id,
  validate,
  disable = false,
  style,
  fullWidth,
  defaultValue = '',
}) => {
  return (
    <div className={clsx("flex flex-col gap-2", style)}>
      {label && <label htmlFor={id}>{label}</label>}
      <select
        disabled={disable}
        defaultValue={defaultValue}
        className={clsx("form-select cursor-pointer max-h-[42px]", fullWidth && "w-full", style, disable && 'bg-slate-400')}
        id={id}
        {...register(id, validate)}
      >
        <option value="">---Choose---</option>
        {options?.map((el) => (
          <option key={el.code} value={el.code}>
            {el.value}
          </option>
        ))}
      </select>
      {errors[id] && (
        <small className="text-xs text-red-500">{errors[id].message}</small>
      )}
    </div>
  );
};
Select.propTypes = {
  label: PropTypes.string,
  options: PropTypes.array,
  register: PropTypes.func,
  errors: PropTypes.object,
  id: PropTypes.string,
  validate: PropTypes.object,
  style: PropTypes.string,
  fullWidth: PropTypes.bool,
  defaultValue: PropTypes.string,
  disable: PropTypes.bool
};
export default memo(Select);
