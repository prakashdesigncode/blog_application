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

import * as jwtDecode from "jwt-decode";
import { fromJS, List, Map } from "immutable";
import { setData } from "../Redux/Dashboard_Redux/reducer";
import { useCallDispatch } from "../Hooks/customHooks";
import { ShowSinglePhoto } from "../Utils/designUtils";
import {
  selectedAlbums,
  selectedCreation,
} from "../Redux/Dashboard_Redux/selector";
import { useSelector } from "react-redux";
import { createAlbums, fetchAlbums } from "../Redux/Dashboard_Redux/thunk";
import { IoMdArrowDropdown } from "react-icons/io";
import { CreateAlbumDialog } from "../Utils/designUtils";
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
  const [setReduxData] = useCallDispatch(setData);
  const [createAlbumApi] = useCallDispatch(createAlbums);
  const [getAlbumsApi] = useCallDispatch(fetchAlbums);
  const [expandedMenu, setExpandedMenu] = useState(false);
  const albumName = searchParams.get("title") || "new album";
  const allAlbums = useSelector(selectedAlbums);
  const [albums, setAlbums] = useState(List([]));
  const [openImage, setOpenImage] = useState(Map({ open: false, key: "" }));
  const decode = jwtDecode.jwtDecode(localStorage.getItem("token"));
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const navigate = useNavigate();

  const handleNavigation = (index, path) => {
    setSearchParams({ current: index });
    setCurrentPage(index);
    navigate(`${path}?current=${index}`);
  };

  const handleCreateAlbum = () => {
    const callBack = () => {
      setReduxData(fromJS({ creation: {} }));
      setSearchParams({});
      getAlbumsApi(jwtDecode.jwtDecode(localStorage.getItem("token")).sub);
    };
    const payload = {
      title: albumName,
      userId: jwtDecode.jwtDecode(localStorage.getItem("token")).sub,
      photoIds: creation
        .entrySeq()
        .map(([key]) => key)
        .toJS(),
    };
    createAlbumApi({ payload, callBack });
  };

  const handleOpenImage = (key, _id) => {
    setOpenImage((prev) =>
      prev
        .set("key", key)
        .set("open", true)
        .set("_id", _id)
        .set("userId", decode.sub)
    );
  };
  const handleCloseImage = () =>
    setOpenImage((prev) => prev.set("open", false));

  useEffect(() => {
    getAlbumsApi(jwtDecode.jwtDecode(localStorage.getItem("token")).sub);
    const pageNo = searchParams.get("current") || 0;
    setCurrentPage(Number(pageNo));
    navigate(`${navigators[pageNo].path}?current=${pageNo}`);
  }, []);

  useEffect(() => {
    setAlbums(List(allAlbums));
  }, [allAlbums]);

  return (
    <>
      <ShowSinglePhoto handleClose={handleCloseImage} open={openImage} />
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
              <div key={index}>
                <div
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
                  {menu.key === 2 && (
                    <div className="ml-auto">
                      {expandedMenu ? (
                        <IoMdArrowDropdown
                          onClick={() => setExpandedMenu(!expandedMenu)}
                          size={25}
                          className="text-neutral-300"
                        />
                      ) : (
                        <IoMdArrowDropdown
                          onClick={() => setExpandedMenu(!expandedMenu)}
                          size={25}
                          className="text-neutral-300 rotate-90"
                        />
                      )}
                    </div>
                  )}
                </div>
                <div>
                  {menu.key === 2 && expandedMenu && (
                    <div className="ml-12 mt-1 mb-3 transition-all duration-300">
                      {albums.map((album, index) => (
                        <CreateAlbumDialog
                          title={album.get("title", "")}
                          photosIds={album.get("photoIds", List())}
                          createdAt={album.get("createdAt", "")}
                          handleOpenImage={handleOpenImage}
                          key={index}
                        >
                          {({ handleClickOpen }) => (
                            <div
                              onClick={handleClickOpen}
                              className="flex  items-center px-4 py-2 my-1 hover:bg-[#282a2c] rounded-lg cursor-pointer text-neutral-300"
                            >
                              <span className="text-sm">
                                {album.get("title", "")}
                              </span>
                            </div>
                          )}
                        </CreateAlbumDialog>
                      ))}
                    </div>
                  )}
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
                placeholder="Search your photos"
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
                title={jwtDecode.jwtDecode(localStorage.getItem("token")).email}
              >
                <div className="cursor-pointer  rounded-full h-8 w-8 flex items-center font-bold capitalize justify-center text-white bg-pink-500 text-1xl">
                  {jwtDecode.jwtDecode(localStorage.getItem("token")).email[0]}
                </div>
              </Tooltip>
            </div>
          </div>
          <div className="bg-[#131314]   flex flex-col gap-6 sm:gap-10    sm:mx-0 sm:px-5 rounded-[3vw] sm:rounded-[1vw] mr-2 sm:mr-4 mt-4 mb-4 scroll-design overflow-scroll">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardCompound;
