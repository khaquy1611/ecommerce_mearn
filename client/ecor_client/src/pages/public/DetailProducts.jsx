import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../../api";

const DetailProducts = () => {
  const { pid, title } = useParams();
  console.log("pid", pid);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchProductData = async () => {
    const response = await getProduct(pid);
    console.log("rs", response);
  };
  useEffect(() => {
    if (pid) {
      fetchProductData();
    }
  }, [fetchProductData, pid]);
  return (
    <div className="w-full">
      <div className="h-[81px] flex justify-center items-center bg-gray-100">
        <div className="w-main">
          <h3>{title}</h3>
        </div>
      </div>
    </div>
  );
};

export default DetailProducts;
