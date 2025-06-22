import { Button, Divider, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlet, useSearchParams, useNavigate } from "react-router-dom";
// import { handleLogout } from "../Utils/customfunctions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { IoSearchSharp } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { MdImage } from "react-icons/md";
import { BiPhotoAlbum } from "react-icons/bi";
import { AddPhotoPopover } from "../Utils/designUtils";
import { IoClose } from "react-icons/io5";

import * as jwt_decode from "jwt-decode";
import { fromJS, List } from "immutable";
import { setData } from "../Redux/Dashboard_Redux/reducer";
import { useCallDispatch } from "../Hooks/customHooks";
import { selectedCreation } from "../Redux/Dashboard_Redux/selector";
import { useSelector } from "react-redux";

/*--------------------Utils Start-------------------------*/
const navigators = [
  {
    name: "Photos",
    key: 1,
    path: "photos",
    icon: (
      <MdImage size={22} className="text-neutral-300 mx-2" variant={"stroke"} />
    ),
  },
  { name: "Collections" },
  {
    name: "Albums",
    key: 2,
    path: "albums",
    icon: (
      <BiPhotoAlbum
        size={22}
        className="text-neutral-300 mx-2"
        variant={"stroke"}
      />
    ),
  },
];
/*--------------------Utils Start-------------------------*/

const DashboardCompound = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const creation = useSelector(selectedCreation);
  const [setRedux] = useCallDispatch(setData);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const navigate = useNavigate();

  const handleNavigation = (index, path) => {
    setSearchParams({ current: index });
    setCurrentPage(index);
    navigate(`${path}?current=${index}`);
  };

  const handleCreateAlbum = () => {};

  useEffect(() => {
    const pageNo = searchParams.get("current") || 0;
    setCurrentPage(Number(pageNo));
    navigate(`${navigators[pageNo].path}?current=${pageNo}&creation=true`);
  }, []);

  return (
    <div className="bg-[#1E1F20] w-full [overflow:hidden] h-dvh  sm:grid sm:grid-cols-[minmax(150px,14%)_1fr]">
      <div className=" flex sm:flex-col mt-5 px-5 ">
        <div className="mx-2">
          <span className="text-white font-semibold text-[20px]">Google</span>
          <span className="text-neutral-400 font-semibold text-[20px] mx-1">
            Photos
          </span>
        </div>
        <div className="mt-10">
          {navigators.map((menu, index) => (
            <div
              key={index}
              className={`flex items-center px-5 py-3 my-3 ${
                menu.key && currentPage !== index && "hover:bg-[#282a2c]"
              }  gap-3 rounded-4xl cursor-pointer ${
                currentPage === index ? "bg-blue-900" : ""
              }`}
              onClick={() => handleNavigation(index, menu.path)}
            >
              <div>{menu.icon}</div>
              <div className=" font-semibold  mt-1 text-neutral-300 text-[16px]">
                {menu.name}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col ">
        <div className="flex justify-between items-center mt-3">
          <div className="user-input flex items-center ">
            <IoSearchSharp
              size={22}
              color={"#ffffff"}
              variant={"stroke"}
              className="mx-2 ms-4"
            />
            <input
              className="message-input flex-grow-1 w-[650px]"
              placeholder="Search your photos and albums"
              // onChange={handleSearch}
              // value={search}
            />
          </div>

          <div className="flex items-center  gap-4 mx-5  ">
            {creation.size > 0 && (
              <div className="rounded-3xl flex items-center gap-2 text-neutral-300 bg-neutral-600 text-1xl font-semibold px-4 py-2 cursor-pointer ">
                <div> {creation.size} Items Selected </div>
              </div>
            )}
            {creation.size > 0 && (
              <div
                className="rounded-3xl text-white bg-sky-600 text-1xl font-semibold px-4 py-2 cursor-pointer "
                onClick={handleCreateAlbum}
              >
                Done
              </div>
            )}
            <AddPhotoPopover>
              {({ handleClick }) => (
                <Tooltip
                  className="hover:bg-neutral-900 w-10 h-10 rounded-full flex items-center justify-center"
                  title="Create And Add Photos"
                  aria-describedby="add-photo-popover"
                  onClick={handleClick}
                >
                  <div>
                    <GoPlus
                      size={25}
                      color={"#ffffff"}
                      className="cursor-pointer"
                      variant={"stroke"}
                    />
                  </div>
                </Tooltip>
              )}
            </AddPhotoPopover>
            <Tooltip
              title={jwt_decode.jwtDecode(localStorage.getItem("token")).email}
            >
              <div className="cursor-pointer  rounded-full h-8 w-8 flex items-center font-bold capitalize justify-center text-white bg-pink-500 text-1xl">
                {jwt_decode.jwtDecode(localStorage.getItem("token")).email[0]}
              </div>
            </Tooltip>
          </div>
        </div>
        <div className="bg-[#131314]   flex flex-col gap-6 sm:gap-10 px-4 mx-3 sm:mx-0 sm:px-10 rounded-[3vw] sm:rounded-[1vw] mr-2 sm:mr-4 mt-4 mb-4 scroll-design overflow-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardCompound;
