/* eslint-disable react/jsx-key */
import { useMemo } from "react";
import { generateRange } from "../ultils/helper";
import { BiDotsHorizontalRounded } from "react-icons/bi";

const usePagination = (totalCount, currentPage, siblingsCount = 1) => {
  const paginationArray = useMemo(() => {
    const pageSize = +import.meta.env.VITE_REACT_APP_LIMIT || 10;
    const totalPageCount = Math.ceil(+totalCount / pageSize);
    const toalPageNumbers = +siblingsCount + 5;
    if (toalPageNumbers >= totalPageCount) {
      return generateRange(1, totalPageCount);
    }
    const leftSiblingIndex = Math.max(currentPage - siblingsCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingsCount,
      totalPageCount
    );
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;
    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingsCount;
      let leftRange = generateRange(1, leftItemCount);

      return [...leftRange, <BiDotsHorizontalRounded />, totalPageCount];
    }
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingsCount;
      let rightRange = generateRange(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [firstPageIndex, <BiDotsHorizontalRounded />, ...rightRange];
    }

    /*
          Case 4: Both left and right dots to be shown
      */
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = generateRange(leftSiblingIndex, rightSiblingIndex);
      return [
        firstPageIndex,
        <BiDotsHorizontalRounded />,
        ...middleRange,
        <BiDotsHorizontalRounded />,
        lastPageIndex,
      ];
    }
  }, [totalCount, currentPage, siblingsCount]);

  return paginationArray;
};

export default usePagination;
