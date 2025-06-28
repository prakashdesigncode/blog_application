import { Fragment, useEffect, useRef, useState } from "react";
import React from "react";
import Popover from "@mui/material/Popover";
import {
  Dialog,
  ListItemButton,
  ListSubheader,
  List as MuiList,
  Tooltip,
} from "@mui/material";
import { MdImage } from "react-icons/md";
import { BiPhotoAlbum } from "react-icons/bi";
import { FaArrowLeft } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import {
  useBooleanHook,
  useCallDispatch,
  useDebounce,
  useInputHook,
  useSelectedValue,
} from "../Hooks/customHooks";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import TextField from "@mui/material/TextField";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import {
  createAlbums,
  deleteSinglePhoto,
  fetchAlbums,
  fetchPhotos,
  getAlbumPhotos,
  getSingedUrl,
  uploadPhoto,
} from "../Redux/Dashboard_Redux/thunk";
import { Map, List, fromJS } from "immutable";
import * as jwtDecode from "jwt-decode";
import moment from "moment";
import { useNavigate, useSearchParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import { IconButton } from "@mui/material";

import CssBaseline from "@mui/material/CssBaseline";
import ListItem from "@mui/material/ListItem";

import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { Avatar } from "@mui/material";
import { setData } from "../Redux/Dashboard_Redux/reducer";
import { IoMdArrowDropdown } from "react-icons/io";
import { useSelector } from "react-redux";
import {
  selectedAlbums,
  selectedCreation,
} from "../Redux/Dashboard_Redux/selector";

const menuIconSX = {
  width: 40,
  height: 40,
  color: "inherit",
  margin: "12px 22px 12px 4px",
  display: "none",
  "&:hover": {
    backgroundColor: "#2C2D2D",
  },
  "@media (max-width:1007px)": {
    display: "inline-flex",
  },
};

const addIconSX = {
  width: 40,
  height: 40,
  color: "inherit",
  "&:hover": {
    backgroundColor: "#2C2D2D",
  },
};

const searchIconSX = {
  width: 40,
  height: 40,
  color: "inherit",
  "&:hover": {
    backgroundColor: "#2C2D2D",
  },
  display: "none",
  "@media (max-width:1007px)": {
    display: "inline-flex",
  },
};

const powerIconSX = {
  width: 40,
  height: 40,
  color: "inherit",
  marginLeft: "4px",
  "&:hover": {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    color: "red",
  },
};

const profileSX = {
  height: "30px",
  width: "30px",
  fontSize: "12px",
  textTransform: "uppercase",
  background: "red",
  fontWeight: "bold",
  display: "inline-flex",
  "@media (max-width:599px)": {
    display: "none",
  },
};

const SearchBar = () => {
  const [searchText, handleSearchText] = useInputHook();
  const [debounceSearchText] = useDebounce(searchText);
  const [getPhotos] = useCallDispatch(fetchPhotos);
  const decode = jwtDecode.jwtDecode(localStorage.getItem("token"));
  useEffect(() => {
    if (debounceSearchText)
      getPhotos({ userId: decode.sub, searchText: debounceSearchText });
  }, [debounceSearchText]);
  return (
    <div className="search-bar-container">
      <TextField
        className="search-bar"
        variant="outlined"
        placeholder="Search"
        value={searchText}
        onChange={handleSearchText}
        fullWidth
        sx={{ background: "transparent", flex: "1" }}
        slotProps={{
          input: {
            startAdornment: <SearchIcon sx={{ margin: "0 15px 0 10px" }} />,
          },
        }}
      />
    </div>
  );
};

const mockListItems = [
  {
    label: "Photos",
    icon: <ImageOutlinedIcon />,
    path: "photos",
  },
  {
    label: "Collections",
    icon: <HorizontalRuleIcon />,
  },
  { label: "Albums", icon: <CollectionsBookmarkIcon />, path: "albums" },
];

const drawerWidth = "256px";

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `80px`,
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  height: "64px",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  zIndex: theme.zIndex.drawer + 1,
  [theme.breakpoints.down("sm")]: {
    zIndex: "auto",
  },
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

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
    getPhotos({ userId: decode.sub });
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
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          sx: {
            background: "#1E1F20",
            borderRadius: "12px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
            border: "1px solid #2A2B2E",
            paddingY: 1,
          },
        }}
      >
        <MuiList
          sx={{
            width: "100%",
            maxWidth: 400,
            minWidth: 250,
            minHeight: 50,
            maxHeight: 140,
          }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader
              component="div"
              sx={{
                backgroundColor: "#1E1F20",
                color: "#ccc",
                fontWeight: "bold",
                fontSize: "16px",
                paddingY: 0,
                paddingX: 2,
                borderBottom: "1px solid #333",
              }}
              id="nested-list-subheader"
            >
              Create
            </ListSubheader>
          }
        >
          <ListItemButton
            sx={{
              "&:hover": {
                backgroundColor: "#2C2D30",
              },
              paddingY: 1,
              paddingX: 2,
            }}
          >
            <ListItemIcon>
              <MdImage className="text-neutral-300 ms-1" size={22} />
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
              primary={
                <div className="font-medium text-neutral-300">
                  Import Photos
                </div>
              }
            />
          </ListItemButton>

          {/* Create Album */}
          <CreateAlbumDialog handleClosePopover={handleClose}>
            {({ handleClickOpen }) => (
              <ListItemButton
                onClick={handleClickOpen}
                sx={{
                  "&:hover": {
                    backgroundColor: "#2C2D30",
                  },
                  paddingY: 1,
                  paddingX: 2,
                }}
              >
                <ListItemIcon>
                  <BiPhotoAlbum className="text-neutral-300 ms-1" size={22} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <div className="font-medium text-neutral-300">Album</div>
                  }
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
  handleClosePopover = () => {},
}) => {
  const [input, setInput] = useInputHook("Sample Album");
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
      if (!input) return;
      handleClosePopover();
      const newParams = new URLSearchParams(params.toString());
      setSearchParams({ title: input });
      navigate({
        pathname: "/photos",
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
                  className="w-full bg-transparent border-b-2 outline-none text-white border-b-neutral-300
             text-2xl sm:text-3xl md:text-4xl h-12 sm:h-14 md:h-16"
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
                    className={` h-auto w-full object-cover rounded ${
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

export const ShowSinglePhoto = ({ handleClose, open, isAlbum = false }) => {
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
            {!isAlbum && (
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
            )}
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

export const MiniDrawer = ({ children }) => {
  const [open, setOpen] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const container =
    typeof window !== "undefined" ? () => window.document.body : undefined;

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1007) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const drawerContent = (
    <Box
      onClick={handleDrawerToggle}
      sx={{ textAlign: "center", padding: "0 12px 0 12px" }}
    >
      <Box
        sx={{
          height: "64px",
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
        }}
      >
        <Avatar alt="Profile" sx={profileSX} />
      </Box>
      <Box
        className="flex items-center justify-center"
        sx={{
          height: "64px",
          paddingBottom: "1px",
          whiteSpace: "nowrap",
        }}
      >
        <span className="logo" />
        <span className="header-title">Photos</span>
      </Box>
      <MuiList style={{ padding: 0 }}>
        <MenuList open={open} mobileOpen={mobileOpen} />
      </MuiList>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" elevation={0}>
        <Header onClickOpen={handleDrawerToggle} />
      </AppBar>

      <MuiDrawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerClose}
        onTransitionEnd={handleDrawerTransitionEnd}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            background: "#1e1f20",
            color: "#c4c7c5",
            border: "none",
          },
        }}
      >
        {drawerContent}
      </MuiDrawer>

      <Drawer
        variant="permanent"
        open={open}
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            background: "#1e1f20",
            color: "#c4c7c5",
            border: "none",
          },
        }}
      >
        <DrawerHeader />
        <MuiList sx={{ padding: "24px 12px 16px 12px" }}>
          <MenuList open={open} mobileOpen={mobileOpen} />
        </MuiList>
      </Drawer>

      <Box
        component="main"
        style={{
          height: "100dvh",
          width: "100%",
          overflow: "auto",
          background: "#1e1f20",
          color: "#e3e3e3",
        }}
      >
        <DrawerHeader />
        <Box
          sx={{
            height: "calc(100dvh - 74px)",
            overflow: "auto",
            background: "#131314",
            color: "#e3e3e3",
            marginRight: { xs: "0px", sm: "20px" },
            marginBottom: { xs: "10px", sm: "0px" },
            borderRadius: { xs: "0px", sm: "20px" },
            paddingRight: "32px",
            paddingLeft: "16px",
            paddingTop: "12px",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

const Header = ({ onClickOpen }) => {
  const navigate = useNavigate();
  const [setReduxData] = useCallDispatch(setData);
  const [creation] = useSelectedValue(selectedCreation);
  const [searchParams, setSearchParams] = useSearchParams();
  const [createAlbumApi] = useCallDispatch(createAlbums);
  const [getAlbumsApi] = useCallDispatch(fetchAlbums);
  const [uploadImages] = useCallDispatch(uploadPhoto);
  const decode = jwtDecode.jwtDecode(localStorage.getItem("token"));
  const albumName = searchParams.get("title") || "new album";
  const email = decode.email;
  const file = useRef(null);
  const handleLogout = () => {
    setReduxData(fromJS({ userPhotos: [], albums: [] }));
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCreateAlbum = (ids) => {
    const callBack = () => {
      setReduxData(fromJS({ creation: {} }));
      setSearchParams({});
      getAlbumsApi(jwtDecode.jwtDecode(localStorage.getItem("token")).sub);
    };
    const payload = {
      title: albumName,
      userId: jwtDecode.jwtDecode(localStorage.getItem("token")).sub,
      photoIds: ids.length ? ids : creation.toJS(),
    };
    createAlbumApi({ payload, callBack });
  };

  const handleFileInput = (event) => {
    const callBack = ({ results }) => {
      const ids = results.map((value) => value._id);
      handleCreateAlbum(ids);
    };
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

  return (
    <header>
      <div className="header-left">
        <IconButton sx={menuIconSX} onClick={onClickOpen}>
          <MenuIcon />
        </IconButton>
        <span className="logo head_logo" />
        {creation.size <= 0 && <span className="header-title">Photos</span>}
      </div>
      <div className="flex justify-between grow-1 items-center">
        <SearchBar />
        <div className="grow-1 header-right">
          {creation.size <= 0 && (
            <IconButton sx={searchIconSX}>
              <SearchIcon />
            </IconButton>
          )}

          {creation.size <= 0 && searchParams.get("title") && (
            <div
              onClick={handleOpenFile}
              className="cursor-pointer text-blue-500 mr-4"
            >
              Select Form Computer
            </div>
          )}
          <input
            ref={file}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          {creation.size > 0 && (
            <div className="flex items-center gap-2">
              <div
                style={{ padding: "7px 20px" }}
                className="rounded-3xl flex items-center gap-2 text-neutral-300 bg-neutral-600 text-sm sm:text-base font-semibold cursor-pointer"
              >
                <div>{creation.size} Items Selected</div>
              </div>
              <div
                className="rounded-3xl text-white bg-sky-600 text-sm sm:text-base font-semibold  cursor-pointer"
                style={{ padding: "7px 20px" }}
                onClick={handleCreateAlbum}
              >
                Done
              </div>
            </div>
          )}
          {creation.size <= 0 && (
            <>
              <AddPhotoPopover>
                {({ handleClick }) => (
                  <Tooltip
                    title="Create And Add Photos"
                    aria-describedby="add-photo-popover"
                    onClick={handleClick}
                  >
                    <IconButton sx={addIconSX}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </AddPhotoPopover>

              <Tooltip title={email}>
                <Avatar alt="Profile" sx={profileSX}>
                  {email[0]}
                </Avatar>
              </Tooltip>
              <Tooltip title="Logout">
                <IconButton sx={powerIconSX} onClick={handleLogout}>
                  <PowerSettingsNewIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const MenuList = ({ open, mobileOpen }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [expandedMenu, setExpandedMenu] = useBooleanHook(false);
  const [getAlbumsApi] = useCallDispatch(fetchAlbums);
  const [albums, setAlbums] = useState(List([]));
  const allAlbums = useSelector(selectedAlbums);
  const navigate = useNavigate();
  const handleNavigation = (path) => {
    setSearchParams({ current: path });
    navigate(`/${path}?current=${path}`);
  };
  const path = searchParams.get("current") || "photos";
  useEffect(() => {
    getAlbumsApi(jwtDecode.jwtDecode(localStorage.getItem("token")).sub);
  }, []);

  useEffect(() => {
    setAlbums(List(allAlbums));
  }, [allAlbums]);
  return (
    <Fragment>
      {mockListItems.map((item, index) => (
        <ListItem
          sx={{ padding: item.path && "15px 0" }}
          key={item.label}
          disabled={!item.path}
          onClick={() => item.path && handleNavigation(item.path)}
          disablePadding
        >
          <ListItemButton
            selected={item.path === path && item.path}
            sx={{
              borderRadius: "30px",
              justifyContent: open ? "initial" : "center",
              padding: "12px 30px 12px 28px",
              "&:hover": {
                backgroundColor: item.path && "#2E2F2F",
              },
              "&.Mui-selected": {
                backgroundColor: "#004A77",
              },
            }}
          >
            {index === 2 && (
              <IoMdArrowDropdown
                size={25}
                className={`text-neutral-300 absolute right-4 ${
                  !expandedMenu && "rotate-90"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedMenu(!expandedMenu);
                }}
              />
            )}
            {item.label === "Collections" ? (
              !open && !mobileOpen ? (
                <ListItemIcon
                  sx={{
                    justifyContent: "center",
                    color: "#c4c7c5",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              ) : null
            ) : (
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                  color: "#c4c7c5",
                }}
              >
                {item.icon}
              </ListItemIcon>
            )}

            <ListItemText
              primary={<div className="font-semibold">{item.label}</div>}
              sx={{
                opacity: open || mobileOpen ? 1 : 0,
                marginLeft: mobileOpen ? "10px" : "0px",
              }}
            />
          </ListItemButton>
        </ListItem>
      ))}
      {expandedMenu && (
        <div className="hidden sm:block ml-8 sm:ml-12 mt-1 mb-3 transition-all duration-300">
          {albums.map((album, index) => (
            <CreateAlbumDialog
              title={album.get("title", "")}
              photosIds={album.get("photoIds", List())}
              createdAt={album.get("createdAt", "")}
              // handleOpenImage={handleOpenImage}
              key={index}
            >
              {({ handleClickOpen }) => (
                <div
                  onClick={handleClickOpen}
                  className="flex  items-center  px-3 sm:px-4 py-1 sm:py-2 my-1 hover:bg-[#282a2c] rounded-lg cursor-pointer text-neutral-300"
                >
                  <img
                    src={album.get("thumbnail", "")}
                    className="w-10 h-10 rounded object-cover mr-3"
                  />
                  <span className="text-sm sm:text-[17px]  truncate max-w-[120px]">
                    {album.get("title", "")}
                  </span>
                </div>
              )}
            </CreateAlbumDialog>
          ))}
        </div>
      )}
    </Fragment>
  );
};
