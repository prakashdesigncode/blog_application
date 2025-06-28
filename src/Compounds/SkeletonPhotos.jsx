import React from "react";

const SkeletonPhotos = () => {
  const template = Array.from({ length: 16 });
  return (
    <>
      {template.map((_, index) => {
        return (
          <div
            key={index}
            className=" animate-pulse w-93 gap-4 flex justify-center flex-col max-w-sm rounded-md   p-4"
          >
            <div className="h-5  w-50 rounded-3xl bg-neutral-300 "></div>
            <div className="h-65 w-full  bg-neutral-300"></div>
          </div>
        );
      })}
    </>
  );
};

export default SkeletonPhotos;
