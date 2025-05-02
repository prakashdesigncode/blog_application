import React from "react";

const Home = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  return (
    <div className="flex grow">
      <div className="flex flex-col gap-6 sm:gap-10 py-10 sm:py-[80px] px-4 sm:px-0">
        <div className="text-3xl sm:text-6xl font-bold flex flex-wrap gap-2.5 items-center">
          Welcome <span className="text-rose-500">{user.username}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 sm:size-8 animate-pulse"
          >
            <path d="M10.5 1.875a1.125 1.125 0 0 1 2.25 0v8.219c.517.162 1.02.382 1.5.659V3.375a1.125 1.125 0 0 1 2.25 0v10.937a4.505 4.505 0 0 0-3.25 2.373 8.963 8.963 0 0 1 4-.935A.75.75 0 0 0 18 15v-2.266a3.368 3.368 0 0 1 .988-2.37 1.125 1.125 0 0 1 1.591 1.59 1.118 1.118 0 0 0-.329.79v3.006h-.005a6 6 0 0 1-1.752 4.007l-1.736 1.736a6 6 0 0 1-4.242 1.757H10.5a7.5 7.5 0 0 1-7.5-7.5V6.375a1.125 1.125 0 0 1 2.25 0v5.519c.46-.452.965-.832 1.5-1.141V3.375a1.125 1.125 0 0 1 2.25 0v6.526c.495-.1.997-.151 1.5-.151V1.875Z" />
          </svg>
        </div>
        <div className="text-lg sm:text-3xl font-semibold welcome-text">
          Qikberry specializes in
          <span className="text-rose-500"> content strategy</span>,
          <span className="text-rose-500"> blog marketing</span>, &{" "}
          <span className="text-rose-500"> SEO optimization</span>
        </div>
        <div>
          <div className="text-sm sm:text-base text-gray-400 welcome-text font-bold">
            He helps brands grow by crafting impactful content that drives
            traffic and engagement
          </div>
          <button className="mt-6 sm:mt-10 text-rose-600 py-2 sm:py-3 border-2 rounded border-rose-500 px-4 sm:px-5 text-sm sm:text-base">
            Subscribe for Tips!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
