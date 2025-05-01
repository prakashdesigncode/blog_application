import React from "react";
import { fetchPhotosData } from "../Redux/Dashboard_Redux/tunk";
import {
  selectedIsLoading,
  selectedPhotos,
} from "../Redux/Dashboard_Redux/selector";
import { useInfinateScroll, useSelectedValue } from "../Hooks/customHooks";
import defaultImage from "../assets/defaut.png";
import Skeleton from "./SkeletonPhotos";

const Photos = () => {
  const [infinate, isInterSecting] = useInfinateScroll(
    selectedPhotos,
    fetchPhotosData
  );
  const [isLoading] = useSelectedValue(selectedIsLoading);
  return (
    <div className="flex flex-wrap gap-10">
      {isLoading ? (
        <Skeleton />
      ) : (
        infinate.map((value, index) => (
          <div
            className="flex flex-col gap-4 grow-1  w-86 "
            ref={infinate.size - 1 === index ? isInterSecting : null}
            key={index}
          >
            <img
              className="h-64 w-96 object-cover rounded-3xl"
              src={defaultImage}
            />
            <div className="text-gray-800 font-bold text-1xl mx-3 self-start">
              {index + 1} . {value.get("title", "")}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Photos;
