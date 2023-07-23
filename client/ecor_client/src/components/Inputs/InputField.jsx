/* eslint-disable react-refresh/only-export-components */
import { useState, memo } from "react";
import PropTypes from "prop-types";
import icons from "../../ultils/icon";
const InputField = ({
  value,
  setValue,
  nameKey,
  type,
  invalidFields,
  setInvalidFields
}) => {
  console.log('invalidFields', invalidFields);
  const [showPassWord, setShowPassWord] = useState(false);
  const { HiEyeOff, HiEye } = icons;
  return (
    <div className="w-full flex flex-col gap-1 relative mb-2">
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
            className="px-4 py-2 rounded-sm border mt-2 w-full  placeholder:text=sm placeholder:text-italic"
            placeholder={`${
              nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)
            }...`}
            value={value}
            onChange={(e) =>
              setValue((prev) => ({ ...prev, [nameKey]: e.target.value }))
            }
            onFocus={() => {
              setInvalidFields([])
            }}
          />
        ) : (
          <input
            type="text"
            className="px-4 py-2 rounded-sm border w-full mt-2 placeholder:text=sm placeholder:text-italic"
            placeholder={`${
              nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)
            }...`}
            value={value}
            onChange={(e) =>
              setValue((prev) => ({ ...prev, [nameKey]: e.target.value }))
            }
            onFocus={() => {
              setInvalidFields([])
            }}
          />
        )}
        {invalidFields?.some((el) => el.name === nameKey) && (
          <small className="text-main text-[12px] italic">
            {invalidFields?.find((el) => el.name === nameKey)?.mes}
          </small>
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
  invalidFields: PropTypes.array,
  setInvalidFields:  PropTypes.func,
};
export default memo(InputField);
