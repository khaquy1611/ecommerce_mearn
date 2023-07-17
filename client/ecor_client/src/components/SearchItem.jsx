/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, memo, useEffect } from "react";
import PropTypes from "prop-types";
import icons from "../ultils/icon";
import { colors } from "../ultils/contains";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import { getProducts } from "../api";
import useDebounce from "./../hooks/useDebounce";
import { toast } from "react-toastify";
const SearchItem = ({
  name,
  activeClick,
  changeActiveFilter,
  type = "checkbpx",
}) => {
  const [selected, setSelected] = useState([]);
  const [price, setPrice] = useState({
    from: "",
    to: "",
  });
  const [bestPrice, setBestPrice] = useState(null);
  const { category } = useParams();
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

  const fetchBestPriceProduct = async () => {
    const response = await getProducts({ sort: "-price", limit: 1 });
    if (response.success) setBestPrice(response?.productData[0]?.price);
  };

  const handleResetSelected = (e) => {
    e.stopPropagation();
    setSelected([]);
  };

  useEffect(() => {
    if (selected.length > 0) {
      navigate({
        pathname: `/${category}`,
        search: createSearchParams({
          color: selected.join(","),
        }).toString(),
      });
    } else {
      navigate(`/${category}`);
    }
  }, [category, navigate, selected]);

  useEffect(() => {
    if (type === "input") fetchBestPriceProduct();
  }, [type]);
  useEffect(() => {
    if (price.from && price.to) {
      if (price.from > price.to) {
        toast.error(`Giá bắt đầu không được lớn hơn giá kết thúc!..`, {
          theme: "dark",
        });
      } else {
        return;
      }
    }
  }, [price]);
  const debouncePriceFrom = useDebounce(price.from, 500);
  const debouncePriceTo = useDebounce(price.to, 500);
  useEffect(() => {
    const data = {};
    if (Number(price?.from) > 0) data.from = price.from;
    if (Number(price?.to) > 0) data.to = price.to;
    navigate({
      pathname: `/${category}`,
      search: createSearchParams(data).toString(),
    });
  }, [debouncePriceFrom, debouncePriceTo]);
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
                <span className="whitespace-nowrap capitalize">{`${
                  selected.length === 0 ? "No value" : selected
                } selected`}</span>
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
          {type === "input" && (
            <div onClick={(e) => e.stopPropagation()}>
              <div className="p-4 items-center flex justify-between gap-8 border-b">
                <span className="whitespace-nowrap">{`The highest price is ${Number(
                  bestPrice
                ).toLocaleString()} VND Default input value is USD`}</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setPrice({
                      from: "",
                      to: "",
                    });
                    changeActiveFilter(null);
                  }}
                  className="underline cursor-pointer hover:text-main"
                >
                  Reset
                </span>
              </div>
              <div className="flex items-center p-2 gap-2">
                <div className="flex items-center gap-2">
                  <label htmlFor="from">From:</label>
                  <input
                    value={price?.from}
                    onChange={(e) =>
                      setPrice((prev) => ({ ...prev, from: e.target.value }))
                    }
                    className="form-input"
                    type="number"
                    id=""
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="to">To:</label>
                  <input
                    value={price?.to}
                    onChange={(e) =>
                      setPrice((prev) => ({ ...prev, to: e.target.value }))
                    }
                    className="form-input"
                    type="number"
                    id=""
                  />
                </div>
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
