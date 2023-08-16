import { memo } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
// eslint-disable-next-line react-refresh/only-export-components
const InputForm = ({
  label,
  disabled,
  register,
  errors,
  id,
  validate,
  type = "text",
  placeholder,
  fullWidth,
  defaultValue,
  style,
  readOnly
}) => {
  return (
    <div className={clsx("flex flex-col h-[70px] gap-2", style)}>
      {label && <label htmlFor={id}>{label}</label> }
      <input
        type={type}
        id={id}
        {...register(id, validate)}
        disabled={disabled}
        placeholder={placeholder}
        className={clsx("form-input my-auto", fullWidth && "w-full")}
        defaultValue={defaultValue}
        readOnly={readOnly}
      />
      {errors[id] && <small className="text-xs text-red-500">{errors[id]?.message}</small>}
    </div>
  );
};
InputForm.propTypes = {
  label: PropTypes.string,
  disabled: PropTypes.bool,
  register: PropTypes.func,
  errors: PropTypes.object,
  id: PropTypes.string,
  validate: PropTypes.object,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  fullWidth: PropTypes.bool,
  defaultValue: PropTypes.string,
  style: PropTypes.string,
  readOnly: PropTypes.bool
};
// eslint-disable-next-line react-refresh/only-export-components
export default memo(InputForm);
