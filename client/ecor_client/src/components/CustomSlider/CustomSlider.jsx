/* eslint-disable react-refresh/only-export-components */
import { memo } from "react";
import { settings } from "../../ultils/settings";
import PropTypes from "prop-types";
import { Product } from "../../components";
import Slider from "react-slick";
const CustomSlider = ({ products, activeTabs, normal }) => {
  return (
    <Slider className="custom-slider" {...settings}>
      {products &&
        products?.map((el) => (
          <Product
            isNew={activeTabs === 1 ? false : true}
            pid={el._id}
            key={el._id}
            productData={el}
            normal={normal}
          />
        ))}
    </Slider>
  );
};
CustomSlider.propTypes = {
  products: PropTypes.array,
  activeTabs: PropTypes.number,
  normal: PropTypes.bool,
};
export default memo(CustomSlider);
