/* eslint-disable react-refresh/only-export-components */
import { useState, memo, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import logo from "../../assets/logo.png";
import { voteOptions } from "../../ultils/contains";
import { Button } from "../../components";
import icons from "../../ultils/icon";
const VoteOption = ({ nameProduct, handleVoteOptions }) => {
  const [choosenScore, setChoosenScore] = useState(null);
  const [score, setScore] = useState(null);
  const [comment, setComment] = useState("");
  const { AiFillStar } = icons;
  const modalRef = useRef();
  useEffect(() => {
    modalRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
  }, []);
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      ref={modalRef}
      className="bg-white w-[700px] p-4 flex flex-col gap-4 items-center justify-center"
    >
      <img src={logo} alt="logo" className="w-[300px] my-8 object-contain" />
      <h2 className="text-center text-medium text-lg">{`Votings product ${nameProduct}`}</h2>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="form-textarea w-full placeholder:italic placeholder:text-sm placeholder:text-gray-500"
        placeholder="Type Something..."
      ></textarea>
      <div className="w-full flex flex-col gap-4">
        <p>How do you like this product?</p>
        <div className="flex items-center justify-center gap-4">
          {voteOptions &&
            voteOptions?.map((el) => (
              <div
                className="cursor-pointer bg-gray-200 rounded-md p-4 w-[100px] h-[100px] flex items-center justify-center flex-col gap-2"
                key={el.id}
                onClick={() => {
                  setChoosenScore(el.id);
                  setScore(el.id);
                }}
              >
                {Number(choosenScore) && choosenScore >= el.id ? (
                  <AiFillStar color="orange" />
                ) : (
                  <AiFillStar color="gray" />
                )}
                <span>{el.text}</span>
              </div>
            ))}
        </div>
        <Button fw handleOnClick={() => handleVoteOptions({ comment, score })}>
          Submit
        </Button>
      </div>
    </div>
  );
};
VoteOption.propTypes = {
  nameProduct: PropTypes.string,
  handleVoteOptions: PropTypes.func,
};
export default memo(VoteOption);
