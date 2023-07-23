import PropTypes from "prop-types";
const ProductExtraInfoItem = ({ icon, title, sub }) => {
  return (
    <div className="flex items-center p-3 gap-4 mb-[10px] border">
      <span className="p-2 bg-gray-800 rounded-full items-center flex justify-center text-white">{icon}</span>
      <div className="flex flex-col text-sm text-gray-500">
        <span className="font-medium">{title}</span>
        <span className="text-xs">{sub}</span>
      </div>
    </div>
  );
};
ProductExtraInfoItem.propTypes = {
  icon: PropTypes.element,
  title: PropTypes.string,
  sub: PropTypes.string,
};
export default ProductExtraInfoItem;
