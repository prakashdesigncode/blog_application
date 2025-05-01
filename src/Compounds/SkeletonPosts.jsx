import React from "react";

const SkeletonPosts = () => {
  const template = Array.from({ length: 16 });
  return (
    <>
      {template.map(() => {
        return (
          <div className="mx-auto animate-pulse border-2 w-96  border-neutral-300 gap-10 flex justify-center flex-col max-w-sm rounded-md  p-4">
            <div className="h-24 w-84  bg-neutral-300"></div>
            <div className="h-48  w-84  bg-neutral-300 "></div>
          </div>
        );
      })}
    </>
  );
};

export default SkeletonPosts;
