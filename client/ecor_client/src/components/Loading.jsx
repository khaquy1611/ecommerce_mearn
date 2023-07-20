/* eslint-disable react-refresh/only-export-components */
import { memo } from "react";
import { HashLoader } from "react-spinners";
const Loading = () => {
  return (
    <HashLoader color="#ee3131" />
  )
};

export default memo(Loading);
