/* eslint-disable react-refresh/only-export-components */
import { useState, memo } from "react";
import PropTypes from "prop-types";
import icons from "../ultils/icon";
const InputField = ({
  value,
  setValue,
  nameKey,
  type,
  invalidField,
  setInvalidField,
}) => {
  const [showPassWord, setShowPassWord] = useState(false);
  const { HiEyeOff, HiEye } = icons;
  return (
    <div className="w-full relative">
      {value.trim() !== "" && (
        <label
          className="text-[14px] z-10 text-gray-800 absolute top-0 left-[12px] block px-1 animate-slide-top-sm"
          htmlFor={nameKey}
        >
          {nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
        </label>
      )}

      <div className="w-full relative">
        {!showPassWord && type === "password" ? (
          <input
            type="password"
            className="px-4 py-2 rounded-sm border w-full my-2 placeholder:text=sm placeholder:text-italic"
            placeholder={`${
              nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)
            }...`}
            value={value}
            onChange={(e) =>
              setValue((prev) => ({ ...prev, [nameKey]: e.target.value }))
            }
          />
        ) : (
          <input
            type="text"
            className="px-4 py-2 rounded-sm border w-full my-2 placeholder:text=sm placeholder:text-italic"
            placeholder={`${
              nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)
            }...`}
            value={value}
            onChange={(e) =>
              setValue((prev) => ({ ...prev, [nameKey]: e.target.value }))
            }
          />
        )}

        {type === "password" && (
          <div
            className="absolute top-0 right-0 w-[58px] h-[58px] flex items-center justify-center cursor-pointer"
            onClick={() => setShowPassWord(!showPassWord)}
          >
            {!showPassWord ? <HiEyeOff /> : <HiEye />}
          </div>
        )}
      </div>
    </div>
  );
};
InputField.propTypes = {
  value: PropTypes.string,
  setValue: PropTypes.func,
  type: PropTypes.string,
  nameKey: PropTypes.string,
  setInvalidField: PropTypes.func,
  invalidField: PropTypes.bool,
};
export default memo(InputField);
