/* eslint-disable react-refresh/only-export-components */
import { useState, memo, useEffect} from "react";
import PropTypes from "prop-types";
import icons from "../ultils/icon";
import { colors } from "../ultils/contains";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";

const SearchItem = ({ name, activeClick, changeActiveFilter, type }) => {
  const [selected, setSelected] = useState([]);
  const {category} = useParams();
  const navigate = useNavigate();
  const { AiOutlineDown } = icons;
  const handleSelect = (e) => {
    const alreadyEl = selected.find((el) => el === e.target.value);
    if (alreadyEl) {
      setSelected((prev) => prev.filter((el) => el !== e.target.value));
    } else {
      setSelected((prev) => [...prev, e.target.value]);
    }
    changeActiveFilter(null);
  };

  const handleResetSelected = (e) => {
    e.stopPropagation();
    setSelected([]);
  };

  useEffect(() => {
    navigate({
        pathname: `/${category}`,
        search: selected.length > 0 ? createSearchParams({
            color: selected
        }).toString() : ''
    })
  }, [category, navigate, selected]);
  return (
    <div
      onClick={() => changeActiveFilter(name)}
      className="p-3 text-gray-500 cursor-pointer relative gap-6 text-xs border border-gray-800 flex justify-between items-center"
    >
      <span className="capitalize">{name}</span>
      <AiOutlineDown />
      {activeClick === name && (
        <div className="absolute  z-10 top-[calc(100%+1px)] left-0 w-fit p-4 bg-white min-w-[150px] border">
          {type === "checkbox" && (
            <div className="">
              <div className="py-4 items-center flex justify-center gap-8 border-b">
                <span className="whitespace-nowrap capitalize">{`${selected.length === 0 ? 'No value' : selected } selected`}</span>
                <span
                  onClick={handleResetSelected}
                  className="underline cursor-pointer hover:text-main"
                >
                  Reset
                </span>
              </div>
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col gap-3 mt-4"
              >
                {colors &&
                  colors?.map((el, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        name={el}
                        className="form-checkbox w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:bring-blue-500 dark:focus:ring-blue-600"
                        value={el}
                        onChange={handleSelect}
                        id={el}
                        checked={selected?.some(
                          (selectedItem) => selectedItem === el
                        )}
                      />
                      <label htmlFor={el} className="capitalize text-gray-700">
                        {el}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
SearchItem.propTypes = {
  name: PropTypes.string,
  activeClick: PropTypes.string,
  changeActiveFilter: PropTypes.func,
  type: PropTypes.string,
};
export default memo(SearchItem);
