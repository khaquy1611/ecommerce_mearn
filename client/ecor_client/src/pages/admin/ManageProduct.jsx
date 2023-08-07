/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { InputForm } from "../../components";
import { useForm } from "react-hook-form";
import { getProducts } from "../../api";
import moment from "moment";
import Pagination from "./../../components/Paginations/Pagination";
import {
  useSearchParams,
  createSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
const ManageProduct = () => {
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm();
  const navigate = useNavigate();
  const localtion = useLocation();
  const [params] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [counts, setCounts] = useState(0);
  const handleSearchProduct = (data) => {
    console.log("data", data);
  };
  const fetchProductData = async (params) => {
    const response = await getProducts({
      ...params,
      limit: import.meta.env.VITE_REACT_APP_LIMIT,
    });
    if (response.success) {
      setCounts(response.total);
      setProducts(response.productData);
    }
  };
  const queryDebounce = useDebounce(watch("q", 800));
  useEffect(() => {
    if (queryDebounce) {
      navigate({
        pathname: localtion.pathname,
        search: createSearchParams({ q: queryDebounce }).toString(),
      });
    } else {
      navigate({
        pathname: localtion.pathname,
      });
    }
  }, [queryDebounce]);

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    fetchProductData(searchParams);
  }, [params]);
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="h-[69px] w-full"></div>
      <div className="px-4 border-b w-full bg-gray-100 flex justify-between items-center fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý sản phẩm</h1>
      </div>
      <div className="flex w-full justify-end items-center px-4">
        <form className="w-[45%]" onSubmit={handleSubmit(handleSearchProduct)}>
          <InputForm
            id="q"
            register={register}
            errors={errors}
            fullWidth
            placeholder="Tìm kiếm sản phẩm theo tiêu đề, mô tả..."
          />
        </form>
      </div>
      <table className="table-auto">
        <thead>
          <tr className="border bg-sky-900 text-white border-white">
            <th className="text-center py-2">Thứ tự</th>
            <th className="text-center py-2">Hình thu nhỏ</th>
            <th className="text-center py-2">Tên sản phẩm</th>
            <th className="text-center py-2">Nhãn hiệu</th>
            <th className="text-center py-2">Danh mục</th>
            <th className="text-center py-2">Gía</th>
            <th className="text-center py-2">Số lượng</th>
            <th className="text-center py-2">Đã bán</th>
            <th className="text-center py-2">Màu sắc</th>
            <th className="text-center py-2">Đánh giá</th>
            <th className="text-center py-2">Ngày tạo</th>
          </tr>
        </thead>
        <tbody>
          {products &&
            products?.map((el, index) => (
              <tr className="border-b" key={el._id}>
                <td>
                  {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                    import.meta.env.VITE_REACT_APP_LIMIT +
                    index}
                </td>
                <td>
                  <img
                    src={el.thumb}
                    alt="thumb"
                    className="w-12 h-12 object-cover"
                  />
                </td>
                <td className="text-center py-2">{el.title}</td>
                <td className="text-center py-2">{el.brand}</td>
                <td className="text-center py-2">{el.category}</td>
                <td className="text-center py-2">{el.price}</td>
                <td className="text-center py-2">{el.quantity}</td>
                <td className="text-center py-2">{el.sold}</td>
                <td className="text-center py-2">{el.color}</td>
                <td className="text-center py-2">{el.totalRatings}</td>
                <td className="text-center py-2">
                  {moment(el.createdAt).format("DD/MM/YYYY")}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="w-full flex justify-end my-8">
        <Pagination totalCount={counts} />
      </div>
    </div>
  );
};

export default ManageProduct;
