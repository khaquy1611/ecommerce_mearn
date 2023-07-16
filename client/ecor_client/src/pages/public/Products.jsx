import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Masonry from "react-masonry-css";
import { Breadcrumbs, Product, SearchItem } from "../../components";
import { getProducts } from "../../api";
const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};
const Products = () => {
  const [products, setProducts] = useState(null);
  const [activeClick, setActiveClick] = useState(null);
  const { category } = useParams();
  const [params] = useSearchParams();
  const fetchProductsByCategory = async (queries) => {
    const response = await getProducts(queries);
    if (response.success) setProducts(response?.productData);
  };
  useEffect(() => {
    let param = [];
    for (let i of params.entries()) {
      param.push(i);
    }
    const queries = {};
    for (let i of param) {
      queries[i[0]] = i[1];
    }
    fetchProductsByCategory(queries);
  }, [params]);
  const changeActiveFilter = useCallback(
    (name) => {
      if (activeClick === name) setActiveClick(null);
      else setActiveClick(name);
    },
    [activeClick]
  );
  return (
    <div className="w-full">
      <div className="h-[81px] flex justify-center items-center bg-gray-100">
        <div className="w-main">
          <h3 className="font-semibold">{category}</h3>
          <Breadcrumbs category={category} />
        </div>
      </div>
      <div className="w-main border p-4 flex justify-between mt-8 m-auto">
        <div className="w-4/5 flex flex-auto flex-col gap-3">
          <span className="font-semibold text-sm">Lọc theo:</span>
          <div className="flex gap-4 items-center">
            <SearchItem
              name="price"
              activeClick={activeClick}
              changeActiveFilter={changeActiveFilter}
              type="input"
            />
            <SearchItem
              name="color"
              activeClick={activeClick}
              changeActiveFilter={changeActiveFilter}
              type="checkbox"
            />
          </div>
        </div>
        <div className="w-1/5 flex">Sort By</div>
      </div>
      <div className="mt-8 w-main m-auto">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid flex mx-[-10px]"
          columnClassName="my-masonry-grid_column"
        >
          {products &&
            products?.map((el) => (
              <Product key={el._id} pid={el._id} productData={el} normal={true} />
            ))}
        </Masonry>
      </div>
      <div className="w-full h-[200px]"></div>
    </div>
  );
};

export default Products;
