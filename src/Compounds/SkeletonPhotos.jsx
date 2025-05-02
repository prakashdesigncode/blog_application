import React from "react";

const SkeletonPhotos = () => {
  const template = Array.from({ length: 16 });
  return (
    <>
      {template.map((_, index) => {
        return (
          <div
            key={index}
            className="mx-auto animate-pulse w-full gap-10 flex justify-center flex-col max-w-sm rounded-md  p-4"
          >
            <div className="h-64 w-96 rounded-3xl bg-neutral-300"></div>
            <div className="h-5  w-96 rounded-3xl bg-neutral-300 "></div>
          </div>
        );
      })}
    </>
  );
};

export default SkeletonPhotos;
