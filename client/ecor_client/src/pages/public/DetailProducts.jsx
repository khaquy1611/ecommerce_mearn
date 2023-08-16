/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getProduct, getProducts } from "../../api";
import {
  Breadcrumbs,
  Button,
  SelectQuantity,
  ProductExtraInfoItem,
  ProductInfomation,
  CustomSlider,
} from "../../components";
import clsx from "clsx";
import Slider from "react-slick";
import { settings } from "../../ultils/settings";
import ReactImageMagnify from "react-image-magnify";
import {
  formatMoney,
  formatPrice,
  renderStartFromNumber,
} from "../../ultils/helper";
import { productExtraInfomation } from "../../ultils/contains";
import DOMPurify from "dompurify";

const DetailProducts = () => {
  const { pid, category } = useParams();
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(null);
  const [relatedProduct, setRelatedProduct] = useState(null);
  const [update, setUpdate] = useState(null);
  const [variants, setVariants] = useState("");
  const [currenProduct, setCurrentProduct] = useState({
    title: "",
    thumb: "",
    images: [],
    price: "",
    color: "",
  });
  const [productsVarriants, setProductsVarriants] = useState({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchProductData = async () => {
    const response = await getProduct(pid);
    if (response.success) {
      setProduct(response?.productData);
      setCurrentImage(response?.productData?.thumb);
    }
  };

  const handleClickImage = (e, el) => {
    e.preventDefault();
    setCurrentImage(el);
  };

  const fetchProducts = async () => {
    const response = await getProducts({ category });
    if (response.success) {
      setRelatedProduct(response?.productData);
    }
  };
  useEffect(() => {
    if (pid) {
      fetchProductData();
      fetchProducts();
    }
    window.scroll(0, 0);
  }, [pid]);

  useEffect(() => {
    if (pid) {
      fetchProductData();
    }
  }, [update]);

  const rerender = useCallback(() => {
    setUpdate(!update);
  }, []);

  const handleQuantity = useCallback(
    (number) => {
      if (!Number(number) || Number(number) < 1) {
        return;
      } else {
        setQuantity(number);
      }
    },
    [quantity]
  );

  const handleChangeQuantity = useCallback(
    (flag) => {
      if (flag === "-" && quantity === 1) return;
      if (flag === "-") setQuantity(quantity - 1);
      if (flag === "+") setQuantity(quantity + 1);
    },
    [quantity]
  );
  useEffect(() => {
    if (product) {
      setProductsVarriants(
        product?.varriants?.find((el) => el._id === variants)
      );
    }
  }, []);
  useEffect(() => {
    if (variants) {
      setCurrentProduct((prev) => ({
        ...prev,
        title: productsVarriants?.title,
        thumb: productsVarriants?.thumb,
        images: productsVarriants?.images,
        price: productsVarriants?.price,
        color: productsVarriants?.color,
      }));
    }
  }, [currenProduct]);
  return (
    <div className="w-full">
      <div className="h-[81px] flex justify-center items-center bg-gray-100">
        <div className="w-main">
          <h3 className="font-semibold">
            {currenProduct?.title || product?.title}
          </h3>
          <Breadcrumbs
            title={currenProduct?.title || product?.title}
            category={category}
          />
        </div>
      </div>
      <div className="w-main m-auto mt-4 flex">
        <div className="flex-4 flex flex-col gap-4 w-2/5">
          <div className="h-[458px] w-[450px] flex items-center border overflow-hidden">
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: "Wristwatch by Ted Baker London",
                  isFluidWidth: true,
                  src: currenProduct?.thumb || currentImage,
                },
                largeImage: {
                  src: currenProduct?.thumb || currentImage,
                  width: 1800,
                  height: 1500,
                },
              }}
            />
          </div>

          <div className="w-[458px]">
            <Slider className="images-slider cursor-pointer" {...settings}>
              {currenProduct?.images?.length === 0 &&
                product?.images?.map((el) => (
                  <div
                    onClick={(e) => handleClickImage(e, el)}
                    className="flex w-full justify-beetween"
                    key={el}
                  >
                    <img
                      src={el}
                      alt="sub-product"
                      className="h-[143px] w-[143px] border object-cover"
                    />
                  </div>
                ))}
              {currenProduct?.images?.length > 0 &&
                currenProduct?.images?.map((el) => (
                  <div
                    onClick={(e) => handleClickImage(e, el)}
                    className="flex w-full justify-beetween"
                    key={el}
                  >
                    <img
                      src={el}
                      alt="sub-product"
                      className="h-[143px] w-[143px] border object-cover"
                    />
                  </div>
                ))}
            </Slider>
          </div>
        </div>
        <div className="flex pr-[22px] flex-col gap-4 w-2/5">
          <div className="flex items-center justify-between">
            <h2 className="text-[30px] font-semibold">{`${formatMoney(
              formatPrice(currenProduct?.price || product?.price)
            )} VNĐ`}</h2>
            <span className="text-sm text-main">{`(Kho: ${product.quantity})`}</span>
          </div>
          <div className="flex items-center gap-1">
            {renderStartFromNumber(product.totalRatings)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
            <span className="text-main">{`(Đã bán: ${product.sold} cái)`}</span>
          </div>
          <ul className="list-square text-sm text-gray-500 pl-4">
            {product.description?.length > 1 &&
              product.description?.map((el) => (
                <li className="leading-6" key={el}>
                  {el}
                </li>
              ))}
            {product.description?.length === 1 && (
              <div
                className="text-sm justify-center line-clamp-[10px] mb-8"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product?.description[0]),
                }}
              ></div>
            )}
          </ul>
          <div className="my-4 flex gap-4">
            <span className="font-bold">Color:</span>
            <div className="flex flex-wrap gap-4 items-center w-full">
              <div
                onClick={() => setVariants(null)}
                className={clsx(
                  "flex items-center gap-2 p-2 border cursor-pointer",
                  !variants && "border-red-500"
                )}
              >
                <img
                  src={product.thumb}
                  alt="thumb"
                  className="w-8 h-8 rounded-md object-cover"
                />
                <span>
                  <span>{product.color}</span>
                  <span>{product.price}</span>
                </span>
              </div>
              {product &&
                product?.varriants?.map((el, index) => (
                  <div
                    onClick={() => setVariants(el._id)}
                    className={clsx(
                      "flex items-center gap-2 p-2 border cursor-pointer",
                      variants === el._id && "border-red-500"
                    )}
                    key={index}
                  >
                    <img
                      src={el?.thumb}
                      alt="thumb"
                      className="w-8 h-8 rounded-md object-cover"
                    />
                    <span>
                      <span>{el?.color}</span>
                      <span>{el?.price}</span>
                    </span>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <span className="font-semibold">Quanlity:</span>
              <SelectQuantity
                quantity={quantity}
                handleQuantity={handleQuantity}
                handleChangeQuantity={handleChangeQuantity}
              />
            </div>

            <Button fw>Thêm vào giỏ hàng</Button>
          </div>
        </div>
        <div className="flex-2 w-1/5">
          {productExtraInfomation?.map((el) => (
            <ProductExtraInfoItem
              key={el._id}
              icon={el.icon}
              title={el.title}
              sub={el.sub}
            />
          ))}
        </div>
      </div>
      <div className="w-main m-auto mt-8">
        <ProductInfomation
          rerender={rerender}
          totalRatings={product?.totalRatings}
          ratings={product?.ratings}
          nameProduct={product?.title}
          pid={product?._id}
        />
      </div>
      <div className="w-main m-auto mt-8">
        <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">
          OTHER CUSTOMERS ALSO BUY:
        </h3>
        <CustomSlider normal={true} products={relatedProduct} />
      </div>

      <div className="h-[100px] w-full"></div>
    </div>
  );
};

export default DetailProducts;
