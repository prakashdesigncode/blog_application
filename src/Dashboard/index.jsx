import { Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlet, useSearchParams, useNavigate } from "react-router-dom";
import { handleLogout } from "../Utils/customfunctions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

/*--------------------Utils Start-------------------------*/
const navigators = [
  { name: "Home", key: 0, path: "dashboard" },
  { name: "Posts", key: 1, path: "posts" },
  { name: "Photos", key: 2, path: "photos" },
];
/*--------------------Utils Start-------------------------*/

const DashboardCompound = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const navigate = useNavigate();

  const handleNavigation = (index, path) => {
    setSearchParams({ current: index });
    setCurrentPage(index);
    navigate(`${path}?current=${index}`);
  };

  useEffect(() => {
    const pageNo = searchParams.get("current") || 0;
    setCurrentPage(Number(pageNo));
    navigate(`${navigators[pageNo].path}?current=${pageNo}`);
  }, []);

  return (
    <div className="bg-neutral-300 w-full [overflow:hidden] h-dvh sm:grid sm:grid-cols-[minmax(60px,5%)_1fr]">
      <div className=" flex sm:flex-col px-5   items-center">
        <div className="sm:my-20 my-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-8"
          >
            <path
              fillRule="evenodd"
              d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z"
              clipRule="evenodd"
            />
            <path d="M5.26 17.242a.75.75 0 1 0-.897-1.203 5.243 5.243 0 0 0-2.05 5.022.75.75 0 0 0 .625.627 5.243 5.243 0 0 0 5.022-2.051.75.75 0 1 0-1.202-.897 3.744 3.744 0 0 1-3.008 1.51c0-1.23.592-2.323 1.51-3.008Z" />
          </svg>
        </div>
        <div className="grow sm:flex my-3">
          <Divider
            orientation={isSmallScreen ? "horizontal" : "vertical"}
            flexItem
          />
        </div>
        <div className=" sm:[writing-mode:vertical-lr] font-bold">BLOGGER</div>
        <div className="grow sm:flex  my-3">
          <Divider
            orientation={isSmallScreen ? "horizontal" : "vertical"}
            flexItem
          />
        </div>
        <div className="sm:my-20 my-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-8 logout"
            onClick={() => handleLogout(navigate)}
          >
            <path
              fillRule="evenodd"
              d="M12 2.25a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM6.166 5.106a.75.75 0 0 1 0 1.06 8.25 8.25 0 1 0 11.668 0 .75.75 0 1 1 1.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <div className="bg-stone-100 flex flex-col gap-6 sm:gap-10 px-4 mx-3 sm:mx-0 sm:px-10 rounded-[6vw] sm:rounded-[2.5vw] mr-2 sm:mr-4 mt-4 mb-4 scroll-design overflow-scroll">
        <div className="bg-stone-100 pt-8 sm:pt-12">
          <h3 className="text-black font-extrabold text-2xl sm:text-4xl">
            collections
          </h3>
          <h5 className="text-gray-500 font-bold text-sm sm:text-xl">
            personalized content storyboards
          </h5>
        </div>

        <div className="flex flex-wrap items-center py-5 sm:py-7 gap-2 sm:gap-3 sticky top-0 bg-stone-100 z-10">
          <div className="border-dashed border-2 border-neutral-300 p-3 sm:p-4 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 sm:w-6 sm:h-6"
            >
              <path
                fillRule="evenodd"
                d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {navigators.map((menu, index) => (
            <div
              key={index}
              onClick={() => handleNavigation(index, menu.path)}
              className={`border-2 font-bold text-sm sm:text-base hover:border-rose-600 cursor-pointer border-neutral-300 ${
                currentPage === menu.key
                  ? "bg-rose-600 text-white border-rose-600"
                  : "text-black"
              } p-2 px-5 sm:p-4 sm:px-7 rounded-full`}
            >
              {menu.name}
            </div>
          ))}
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardCompound;
