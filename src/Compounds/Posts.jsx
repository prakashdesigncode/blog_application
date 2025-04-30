import React from "react";
import { selectedPosts } from "../Redux/Dashboard_Redux/selector";
import { fetchPostData } from "../Redux/Dashboard_Redux/tunk";
import { useInfinateScroll } from "../Hooks/customHooks";

const Posts = () => {
  const [infinate, isInterSecting] = useInfinateScroll(
    selectedPosts,
    fetchPostData
  );
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      {infinate.map((value, index) => (
        <div
          ref={infinate.size - 1 === index ? isInterSecting : null}
          key={index}
          style={{
            width: "200px",
            height: "100px",
            border: "2px solid red",
            padding: "10px",
          }}
        >
          {value.get("title", "")}
        </div>
      ))}
    </div>
  );
};

export default Posts;
