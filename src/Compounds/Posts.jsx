import React from "react";
import {
  selectedIsLoading,
  selectedPosts,
} from "../Redux/Dashboard_Redux/selector";
import { fetchPostData } from "../Redux/Dashboard_Redux/thunk";
import { useInfiniteScroll, useSelectedValue } from "../Hooks/customHooks";
import SkeletonPosts from "./SkeletonPosts";

/*-------------------Util Start--------------------*/
const staticColors = [
  "border-t-amber-300",
  "border-t-sky-300",
  "border-t-red-300",
  "border-t-green-300",
];
/*-------------------Util Start--------------------*/

const Posts = () => {
  const [infinite, isInterSecting] = useInfiniteScroll(
    selectedPosts,
    fetchPostData
  );
  const [isLoading] = useSelectedValue(selectedIsLoading);
  return (
    <div className="flex flex-wrap gap-10">
      {isLoading ? (
        <SkeletonPosts />
      ) : (
        infinite.map((value, index) => (
          <div
            ref={infinite.size - 1 === index ? isInterSecting : null}
            key={index}
            className={`h-64 w-96 bg-white grow-1 rounded border-t-6 p-3 px-5 shadow-md grid grid-rows-[1fr_auto] ${
              staticColors[index % staticColors.length]
            }`}
          >
            <div className="text-2xl font-bold text-gray-600">
              {value.get("title", "")}
            </div>
            <div className="text-1xl text-gray-500 font-bold">
              {value.get("body", "")}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Posts;
