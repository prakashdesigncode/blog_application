import { use, useEffect, useRef, useState } from "react";
import React from "react";
import Popover from "@mui/material/Popover";
import {
  Dialog,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  List as MuiList,
} from "@mui/material";
import { MdImage } from "react-icons/md";
import { BiPhotoAlbum } from "react-icons/bi";
import { FaArrowLeft } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";
import { MdDeleteOutline } from "react-icons/md";
import { useCallDispatch, useInputHook } from "../Hooks/customHooks";
import {
  deleteSinglePhoto,
  fetchPhotos,
  getAlbumPhotos,
  getSingedUrl,
  uploadPhoto,
} from "../Redux/Dashboard_Redux/thunk";
import { Map, List, fromJS, set } from "immutable";
import * as jwtDecode from "jwt-decode";
import moment from "moment";
import { useNavigate, useSearchParams } from "react-router-dom";

export const AddPhotoPopover = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const file = useRef(null);
  const decode = jwtDecode.jwtDecode(localStorage.getItem("token"));
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const [uploadImages] = useCallDispatch(uploadPhoto);
  const [getPhotos] = useCallDispatch(fetchPhotos);
  const callBack = () => {
    handleClose();
    getPhotos(decode.sub);
  };
  const handleFileInput = (event) => {
    const formData = new FormData();
    const files = event.target.files;
    [...files].forEach((file) => {
      formData.append(`files`, file);
    });
    formData.append("userId", decode.sub);
    uploadImages({ formData, callBack });
  };
  const handleOpenFile = () => {
    file.current.click();
  };
  const open = Boolean(anchorEl);
  const id = open ? "add-photo-popover" : undefined;
  return (
    <div>
      {children({ handleClick })}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <MuiList
          sx={{
            width: "100%",
            maxWidth: 500,
            minWidth: 250,
            bgcolor: "#1E1F20",
          }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader
              component="div"
              className="text-[14px]"
              sx={{ backgroundColor: "#1E1F20", color: "grey" }}
              id="nested-list-subheader"
            >
              Create
            </ListSubheader>
          }
        >
          <ListItemButton>
            <ListItemIcon>
              <MdImage
                className="text-neutral-300 ms-2"
                size={22}
                variant={"stroke"}
              />
            </ListItemIcon>
            <input
              ref={file}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
            <ListItemText
              onClick={handleOpenFile}
              primary="Import Photos"
              className="text-neutral-300"
            />
          </ListItemButton>
          <CreateAlbumDialog>
            {({ handleClickOpen }) => (
              <ListItemButton onClick={handleClickOpen}>
                <ListItemIcon>
                  <BiPhotoAlbum
                    className="text-neutral-300 ms-2"
                    size={22}
                    variant={"stroke"}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Album"
                  className="text-neutral-300 font-semibold"
                />
              </ListItemButton>
            )}
          </CreateAlbumDialog>
        </MuiList>
      </Popover>
    </div>
  );
};

export const CreateAlbumDialog = ({
  children,
  title = "",
  photosIds = List([]),
  createdAt = "",
  handleOpenImage = () => {},
}) => {
  const [input, setInput] = useInputHook();
  const [params, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const handleInput = (event) => {
    setInput(event);
    setSearchParams({ ...params, title: event.target.value, creation: true });
  };
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = (type) => {
    if (type === "addPhotos") {
      const newParams = new URLSearchParams(params.toString());
      navigate({
        pathname: "/cloud/photos",
        search: newParams.toString(),
      });
    }
    setOpen(false);
  };
  const [getPhotos] = useCallDispatch(getAlbumPhotos);
  const [photos, setPhotos] = useState(List([]));
  const callBack = (data) => setPhotos(fromJS(data));
  const [imageLoading, setImageLoading] = useState(Map({}));
  useEffect(() => {
    if (open) getPhotos({ ids: photosIds.toJS(), callBack });
  }, [open]);
  return (
    <React.Fragment>
      {children({ handleClickOpen })}
      <Dialog fullScreen open={open} onClose={handleClose}>
        <div className="h-dvh bg-[#1E1F20]">
          <div className="p-5  flex gap-25 flex-col">
            <div className="flex justify-between">
              <FaArrowLeft
                className="text-white cursor-pointer"
                size={25}
                onClick={handleClose}
              />
            </div>
            <div className="grow-1 px-10">
              <div>
                <input
                  type="text"
                  value={title ? title : input}
                  onChange={handleInput}
                  disabled={title}
                  placeholder="Add Title"
                  className="w-full bg-transparent border-b-2 outline-0 h-15 text-4xl border-b-neutral-300 text-white"
                />
                {photosIds.size > 0 && (
                  <div className="text-neutral-300 font-bold text-1xl mt-2 mx-3 self-start">
                    {moment(createdAt).format("ddd, MMM D, YYYY")}
                  </div>
                )}
              </div>
              {photosIds.size === 0 && (
                <div className="flex items-center mt-25 gap-5 justify-center w-full flex-col">
                  <div className="text-neutral-300 text-2xl">
                    Album is empty
                  </div>
                  <div>
                    <div
                      onClick={() => handleClose("addPhotos")}
                      className="rounded-3xl bg-sky-600 text-1xl text-neutral-300 font-semibold px-4 py-2 cursor-pointer "
                    >
                      Add photos
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <img src="https://www.gstatic.com/social/photosui/images/empty_state_album_220x204dp.svg" />
                  </div>
                </div>
              )}
            </div>
          </div>
          {photosIds.size > 0 && (
            <div className="flex flex-wrap gap-4  mx-13">
              {photos.map((value, index) => (
                <div className="flex flex-wrap gap-4   w-86 " key={index}>
                  <img
                    onClick={() =>
                      handleOpenImage(
                        value.get("key", ""),
                        value.get("_id", "")
                      )
                    }
                    className={` h-60 w-90 object-cover rounded ${
                      imageLoading.get(index, true) ? "hidden" : "block"
                    }`}
                    src={value.get("thumbnailUrl", "")}
                    onLoad={() =>
                      setImageLoading((prev) => prev.set(index, false))
                    }
                  />
                  {imageLoading.get(index, true) && (
                    <div
                      key={index}
                      className=" animate-pulse w-93 gap-4 flex justify-center flex-col max-w-sm rounded-md   p-4"
                    >
                      <div className="h-55 w-80 rounded-3xl bg-neutral-300"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export const ShowSinglePhoto = ({ handleClose, open }) => {
  const [imageLoading, setImageLoading] = useState(Map({ isLoading: true }));
  const [signedUrl] = useCallDispatch(getSingedUrl);
  const callBack = (url) => setImageLoading((prev) => prev.set("url", url));
  const [deleteImage] = useCallDispatch(deleteSinglePhoto);

  useEffect(() => {
    if (open.get("key", "")) signedUrl({ key: open.get("key"), callBack });
    return () =>
      setImageLoading((prev) => prev.set("url", "").set("isLoading", true));
  }, [open]);
  return (
    <React.Fragment>
      <Dialog fullScreen open={open.get("open", false)} sx={{ zIndex: 1301 }}>
        <div className="p-5 bg-[#1E1F20] flex gap-10 flex-col h-dvh">
          <div className="flex justify-between">
            <FaArrowLeft
              className="text-white cursor-pointer"
              size={25}
              onClick={handleClose}
            />
            <MdDeleteOutline
              className="text-white cursor-pointer"
              size={25}
              onClick={() =>
                deleteImage({
                  _id: open.get("_id", ""),
                  callBack: handleClose,
                  userId: open.get("userId", ""),
                })
              }
            />
          </div>
          <div className="px-10 bg-">
            <img
              className={`object-cover w-full h-[85vh] rounded ${
                imageLoading.get("isLoading", true) ? "hidden" : "block"
              }`}
              src={imageLoading.get("url", "")}
              onLoad={() =>
                setImageLoading((prev) => prev.set("isLoading", false))
              }
            />
            {imageLoading.get("isLoading", true) && (
              <div
                role="status"
                className="w-full h-[85vh] flex justify-center items-center bg-neutral-200 rounded-2xl"
              >
                <svg
                  aria-hidden="true"
                  className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-pink-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </React.Fragment>
  );
};
