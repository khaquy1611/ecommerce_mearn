/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { useState, memo } from "react";
import { productInfoTabs } from "../ultils/contains";
import { renderStartFromNumber } from "../ultils/helper";
import { VoteBar, Button, VoteOption } from "../components";
import PropTypes from "prop-types";
import { productRatings } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../store/categories/categoriesSlice";
import { useNavigate } from "react-router-dom";
import path from "../ultils/path";
import Swal from "sweetalert2";
const ProductInfomation = ({
  totalRatings,
  ratings,
  nameProduct,
  pid,
  rerender,
}) => {
  const [activedTab, setActivedTab] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.user);

  const handleVoteOptions = async ({ comment, score }) => {
    if (!comment || !pid || !score) {
      alert(`Vui lòng đánh giá xong mới submit`);
      return;
    }
    await productRatings({ star: score, comment, pid });
    rerender();
    dispatch(
      showModal({
        isShowModal: false,
        modalShowChildren: null,
      })
    );
  };

  const handleVoteNow = () => {
    if (!isLoggedIn) {
      Swal.fire({
        text: "Đăng nhập để đánh giá",
        cancelButtonText: "Hủy",
        confirmButtonText: "Đến trang đăng nhập",
        title: "OOPS!",
        showCancelButton: true,
      }).then((res) => {
        if (res.isConfirmed) navigate(`/${path.LOGIN}`);
      });
    } else {
      dispatch(
        showModal({
          isShowModal: true,
          modalShowChildren: (
            <VoteOption
              nameProduct={nameProduct}
              handleVoteOptions={handleVoteOptions}
            />
          ),
        })
      );
    }
  };
  return (
    <div>
      <div className="flex items-center gap-2 relative bottom-[-1px]">
        {productInfoTabs.map((el) => (
          <span
            className={`p-2 px-4 cursor-pointer ${
              activedTab === +el.id
                ? "bg-white border border-b-0"
                : "bg-gray-200"
            }`}
            key={el.id}
            onClick={() => setActivedTab(el.id)}
          >
            {el.name}
          </span>
        ))}
      </div>
      <div className="w-full border p-4">
        {productInfoTabs.some((el) => el.id === activedTab) &&
          productInfoTabs.find((el) => el.id === activedTab)?.content}
        {activedTab === 5 && (
          <div className="flex p-4 flex-col">
            <div className="flex">
              <div className="flex-4 border flex flex-col border-red-500 items-center justify-center">
                <span className="flex font-semibold text-3xl">{`${totalRatings}/5`}</span>
                <span className="flex items-center gap-1">
                  {renderStartFromNumber(ratings)?.map((el, index) => (
                    <span key={index}>{el}</span>
                  ))}
                </span>
                <span className="text-sm">{`${ratings?.length} reviewers and comments`}</span>
              </div>
              <div className="flex-6 border flex flex-col p-4 gap-2">
                {Array.from(Array(5).keys())
                  .reverse()
                  .map((el) => (
                    <VoteBar
                      key={el}
                      number={el + 1}
                      ratingsTotal={ratings?.length}
                      ratingsCount={
                        ratings?.filter((element) => element.star === el + 1)
                          ?.length
                      }
                    />
                  ))}
              </div>
            </div>
            <div className="p-4 flex items-center justify-center text-sm flex-col gap-2">
              <span>Do you want reviews this product?</span>
              <Button handleOnClick={() => handleVoteNow()}>Vote now!</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
ProductInfomation.propTypes = {
  totalRatings: PropTypes.number,
  ratings: PropTypes.array,
  nameProduct: PropTypes.string,
  pid: PropTypes.string,
  rerender: PropTypes.func,
};
export default memo(ProductInfomation);
