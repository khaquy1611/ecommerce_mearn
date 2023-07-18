/* eslint-disable react-refresh/only-export-components */
import { memo } from "react";
import { useDispatch } from "react-redux";
import { showModal } from "../store/categories/categoriesSlice";
import PropTypes from "prop-types";
const Modal = ({ children }) => {
  const dispatch = useDispatch();
  return (
    <div
      onClick={() =>
        dispatch(
          showModal({
            isShowModal: false,
            modalShowChildren: null,
          })
        )
      }
      className="absolute inset-0 z-50 bg-overlay flex items-center justify-center"
    >
      {children}
    </div>
  );
};
Modal.propTypes = {
  children: PropTypes.element,
};
export default memo(Modal);
