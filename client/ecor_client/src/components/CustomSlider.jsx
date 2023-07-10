/* eslint-disable react-refresh/only-export-components */
import { memo } from "react";
import { settings } from "../ultils/settings";
import PropTypes from "prop-types";
import { Product } from "../components";
import Slider from "react-slick";
const CustomSlider = ({ products, activeTabs }) => {
  return (
    <Slider {...settings}>
      {products &&
        products.map((el) => (
          <Product
            isNew={activeTabs === 1 ? false : true}
            pid={el._id}
            key={el._id}
            productData={el}
          />
        ))}
    </Slider>
  );
};
CustomSlider.propTypes = {
  products: PropTypes.array,
  activeTabs: PropTypes.number,
};
export default memo(CustomSlider);
