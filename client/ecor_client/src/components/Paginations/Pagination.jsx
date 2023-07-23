import PropTypes from "prop-types";
import usePagination from "../../hooks/usePagination";
import PagiItems from "./PagiItems";
import { useSearchParams } from "react-router-dom";

const Pagination = ({ totalCount }) => {
  const [params] = useSearchParams();
  const pagination = usePagination(totalCount, 2);
  const range = () => {
    const currentPage = +params.get("page");
    const pageSize = +import.meta.env.VITE_REACT_APP_LIMIT || 10;
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalCount);
    return `${start} - ${end}`;
  };
  return (
    <div className="flex w-main justify-between items-center">
      {!+params.get("page") && (
        <span className="text-sm italic">{`Sản phẩm hiển thị 1 - ${
          +import.meta.env.VITE_REACT_APP_LIMIT || 10
        } of ${totalCount}`}</span>
      )}
      {+params.get("page") && (
        <span className="text-sm italic">{`Sản phẩm hiển thị ${range()} of ${totalCount}`}</span>
      )}
      <div className="flex items-center">
        {pagination?.map((el, index) => (
          <PagiItems key={index}>{el}</PagiItems>
        ))}
      </div>
    </div>
  );
};
Pagination.propTypes = {
  totalCount: PropTypes.number,
};
export default Pagination;
