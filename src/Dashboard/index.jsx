import { Button, Divider, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlet, useSearchParams, useNavigate } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { MdImage } from "react-icons/md";
import { BiPhotoAlbum } from "react-icons/bi";
import { AddPhotoPopover } from "../Utils/designUtils";
import { IoClose } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";

import * as jwtDecode from "jwt-decode";
import { fromJS, List, Map } from "immutable";
import { setData } from "../Redux/Dashboard_Redux/reducer";
import {
  useCallDispatch,
  useDebounce,
  useInputHook,
} from "../Hooks/customHooks";
import { ShowSinglePhoto } from "../Utils/designUtils";
import {
  selectedAlbums,
  selectedCreation,
} from "../Redux/Dashboard_Redux/selector";
import { useSelector } from "react-redux";
import {
  createAlbums,
  fetchAlbums,
  fetchPhotos,
} from "../Redux/Dashboard_Redux/thunk";
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
  const [searchText, handleSearchText] = useInputHook();
  const [getPhotos] = useCallDispatch(fetchPhotos);
  const [debounceSearchText] = useDebounce(searchText);

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

  const handleLogout = () => {
    setReduxData(fromJS({ userPhotos: [], albums: [] }));
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    getAlbumsApi(jwtDecode.jwtDecode(localStorage.getItem("token")).sub);
    const pageNo = searchParams.get("current") || 0;
    setCurrentPage(Number(pageNo));
    navigate(`${navigators[pageNo].path}?current=${pageNo}`);
  }, []);

  useEffect(() => {
    setAlbums(List(allAlbums));
  }, [allAlbums]);

  useEffect(() => {
    if (debounceSearchText)
      getPhotos({ userId: decode.sub, searchText: debounceSearchText });
  }, [debounceSearchText]);

  return (
    <>
      <ShowSinglePhoto handleClose={handleCloseImage} open={openImage} />
      <div className="bg-[#1E1F20] w-full overflow-hidden h-dvh flex flex-col sm:grid sm:grid-cols-[minmax(150px,14%)_1fr]">
        <div className="flex flex-row sm:flex-col p-3 sm:p-5 sm:mt-5 overflow-x-auto sm:overflow-x-visible">
          <div className="flex-shrink-0 mx-2 mb-2 sm:mb-0">
            <span className="text-white font-semibold text-[16px] sm:text-[20px]">
              Google
            </span>
            <span className="text-neutral-400 font-semibold text-[16px] sm:text-[20px] mx-1">
              Photos
            </span>
          </div>

          <div className="flex sm:flex-col sm:mt-10 overflow-x-auto sm:overflow-visible">
            {navigators.map((menu, index) => (
              <div key={index} className="flex-shrink-0 sm:flex-shrink">
                <div
                  className={`flex items-center px-2 sm:px-5 py-1 sm:py-3 mx-1 sm:my-3 ${
                    menu.key && currentPage !== index && "hover:bg-[#282a2c]"
                  } gap-1 sm:gap-3 rounded-md sm:rounded-lg cursor-pointer ${
                    currentPage === index ? "bg-blue-900" : ""
                  }`}
                  onClick={() => menu.key && handleNavigation(index, menu.path)}
                >
                  <div className="flex-shrink-0">{menu.icon}</div>
                  <div className="font-semibold text-neutral-300 text-[12px] xs:text-[13px] sm:text-[16px] whitespace-nowrap">
                    {menu.name}
                  </div>
                  {menu.key === 2 && (
                    <div className="ml-auto hidden sm:block">
                      <IoMdArrowDropdown
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedMenu(!expandedMenu);
                        }}
                        size={25}
                        className={`text-neutral-300 ${
                          !expandedMenu && "rotate-90"
                        }`}
                      />
                    </div>
                  )}
                </div>

                {menu.key === 2 && expandedMenu && (
                  <div className="hidden sm:block ml-8 sm:ml-12 mt-1 mb-3 transition-all duration-300">
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
                            className="flex items-center px-3 sm:px-4 py-1 sm:py-2 my-1 hover:bg-[#282a2c] rounded-lg cursor-pointer text-neutral-300"
                          >
                            <span className="text-xs sm:text-sm truncate max-w-[120px]">
                              {album.get("title", "")}
                            </span>
                          </div>
                        )}
                      </CreateAlbumDialog>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex flex-wrap justify-between items-center p-2 sm:p-3">
            <div className="user-input flex items-center w-full sm:w-auto mb-2 sm:mb-0">
              <IoSearchSharp
                size={20}
                color={"#ffffff"}
                variant={"stroke"}
                className="mx-2 ms-4"
              />
              <input
                className="message-input flex-grow w-full sm:w-[350px] md:w-[450px] lg:w-[650px]"
                placeholder="Search your photos"
                value={searchText}
                onChange={handleSearchText}
              />
            </div>

            <div className="flex items-center gap-2 sm:gap-4 mx-2 sm:mx-5 ml-auto">
              {creation.size > 0 && (
                <div className="rounded-3xl flex items-center gap-2 text-neutral-300 bg-neutral-600 text-sm sm:text-base font-semibold px-3 py-1 sm:px-4 sm:py-2 cursor-pointer">
                  <div>{creation.size} Items</div>
                </div>
              )}
              {creation.size > 0 && (
                <div
                  className="rounded-3xl text-white bg-sky-600 text-sm sm:text-base font-semibold px-3 py-1 sm:px-4 sm:py-2 cursor-pointer"
                  onClick={handleCreateAlbum}
                >
                  Done
                </div>
              )}
              <AddPhotoPopover>
                {({ handleClick }) => (
                  <Tooltip
                    className="hover:bg-neutral-900 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
                    title="Create And Add Photos"
                    aria-describedby="add-photo-popover"
                    onClick={handleClick}
                  >
                    <div>
                      <GoPlus
                        size={22}
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
                <div className="cursor-pointer rounded-full h-7 w-7 sm:h-8 sm:w-8 flex items-center font-bold capitalize justify-center text-white bg-pink-500 text-sm sm:text-base">
                  {jwtDecode.jwtDecode(localStorage.getItem("token")).email[0]}
                </div>
              </Tooltip>
              <Tooltip title="Logout">
                <IoIosLogOut
                  onClick={handleLogout}
                  size={24}
                  variant={"stroke"}
                  className="text-neutral-300 cursor-pointer"
                />
              </Tooltip>
            </div>
          </div>

          <div className="bg-[#131314]  flex flex-col gap-4 sm:gap-6 md:gap-10 p-3 sm:px-5 rounded-2xl sm:rounded-[1vw] mx-2 sm:mr-4 mt-2 sm:mt-4 mb-2 sm:mb-4 scroll-design overflow-scroll">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardCompound;
