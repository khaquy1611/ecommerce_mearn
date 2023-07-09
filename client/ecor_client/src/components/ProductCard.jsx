import PropTypes from "prop-types";
import { renderStartFromNumber, formatMoney } from "./../ultils/helper";
const ProductCard = ({ thumb, title, price, totalRatings }) => {
  return (
    <div className="w-1/3 flex-auto px-[10px] mb-[20px]">
      <div className="flex w-full border">
        <img
          src={thumb}
          alt="products"
          className="w-[120px] object-contain p-4"
        />
        <div className="flex flex-col mt-[15px] items-start gap-1 w-full text-xs">
          <span className="line-clamp-1 capitalize text-sm">
            {title?.toLowerCase()}
          </span>
          <span className="flex h-4">
            {renderStartFromNumber(totalRatings)}
          </span>
          <span>{`${formatMoney(price)} VNĐ`}</span>
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  thumb: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  totalRatings: PropTypes.number.isRequired,
};
export default ProductCard;
