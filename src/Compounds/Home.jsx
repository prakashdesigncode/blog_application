import React from "react";

const Home = () => {
  return (
    <div className="flex grow">
      <div className="flex flex-col gap-10 py-[80px]">
        <div className="text-3xl font-semibold welcome-text">
          Qikberry specializes in
          <span className="text-rose-500"> content strategy</span>,
          <span className="text-rose-500"> blog marketing</span>, &{" "}
          <span className="text-rose-500"> SEO optimization</span>
        </div>
        <div>
          <div className="text-gray-400 welcome-text font-bold">
            He helps brands grow by crafting impactful content that drives
            traffic and engagement
          </div>
          <button className="mt-10 text-rose-600 py-3 border-2 rounded border-rose-500 px-5 ">
            Subscribe for Tips!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
