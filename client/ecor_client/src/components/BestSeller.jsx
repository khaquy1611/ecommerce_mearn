import { useState, useEffect } from "react";
import { getProducts } from "../api/product";
import { Product } from "./";
import Slider from "react-slick";
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

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
};

const BestSeller = () => {
  const [bestSellers, setBestSellers] = useState(null);
  const [newProducts, setNewProduct] = useState(null);
  const [activeTabs, setActiveTabs] = useState(1);
  const [products, setProducts] = useState(null);

  const fetchProducts = async () => {
    const response = await Promise.all([
      getProducts({ sort: "-sold" }),
      getProducts({ sort: "createAt" }),
    ]);
    if (response[0]?.success) setBestSellers(response[0]?.productData);
    if (response[1]?.success) setNewProduct(response[1]?.productData);
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (activeTabs === 1) setProducts(bestSellers);
    if (activeTabs === 2) setProducts(newProducts);
  }, [activeTabs, bestSellers, newProducts]);
  return (
    <>
      <div className="flex text-[20px] ml-[-32px]">
        {tabs && tabs.map((el) => (
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
        <Slider {...settings}>
          {products &&
            products.map((el) => (
              <Product
                isNew={activeTabs === 1 ? false : true}
                key={el._id}
                productData={el}
              />
            ))}
        </Slider>
      </div>
      <div className="flex items-center gap-4 mt-4">
       <img src="https://cdn.shopify.com/s/files/1/1903/4853/files/banner2-home2_2000x_crop_center.png?v=1613166657" alt="Banner1" className="flex-1 object-contain"/>
       <img src="https://cdn.shopify.com/s/files/1/1903/4853/files/banner1-home2_2000x_crop_center.png?v=1613166657" alt="Banner2" className="flex-1 object-contain"/>
      </div>
    </>
  );
};

export default BestSeller;
