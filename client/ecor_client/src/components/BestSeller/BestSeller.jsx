import { useState, useEffect } from "react";
import { getProducts } from "../../api/product";
import { CustomSlider } from "..";
import { getProductsActions } from "../../store/product/productActions";
import { useDispatch, useSelector } from "react-redux";
// active tabs
const tabs = [
  {
    id: 1,
    name: `Best sellers`,
  },
  {
    id: 2,
    name: `New Arrivals`,
  },
  {
    id: 3,
    name: `Tablet`,
  },
];

const BestSeller = () => {
  const [bestSellers, setBestSellers] = useState(null);
  const [activeTabs, setActiveTabs] = useState(1);
  const [products, setProducts] = useState(null);
  const dispatch = useDispatch();
  const { newProducts } = useSelector(state => state.productReducer);
  const fetchProducts = async () => {
    const response = await getProducts({ sort: "-sold" });
    if (response?.success) {
      setBestSellers(response?.productData);
      setProducts(response?.productData);
    }
  };
  useEffect(() => {
    fetchProducts();
    dispatch(getProductsActions());
  }, [dispatch]);

  useEffect(() => {
    if (activeTabs === 1) setProducts(bestSellers);
    if (activeTabs === 2) setProducts(newProducts);
  }, [activeTabs, bestSellers, newProducts]);
  return (
    <>
      <div className="flex text-[20px] ml-[-32px]">
        {tabs &&
          tabs.map((el) => (
            <span
              key={el.id}
              className={`font-bold px-8 uppercase border-r text-gray-400 ${
                activeTabs === el.id ? "text-gray-900" : ""
              }`}
              onClick={() => setActiveTabs(el.id)}
            >
              {el.name}
            </span>
          ))}
      </div>
      <div className="mt-4 mx-[-10px] border-t-2 border-main pt-4">
        <CustomSlider products={products} activeTabs={activeTabs} />
      </div>
      <div className="flex items-center gap-4 mt-4">
        <img
          src="https://cdn.shopify.com/s/files/1/1903/4853/files/banner2-home2_2000x_crop_center.png?v=1613166657"
          alt="Banner1"
          className="flex-1 object-contain"
        />
        <img
          src="https://cdn.shopify.com/s/files/1/1903/4853/files/banner1-home2_2000x_crop_center.png?v=1613166657"
          alt="Banner2"
          className="flex-1 object-contain"
        />
      </div>
    </>
  );
};

export default BestSeller;
