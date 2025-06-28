import React, { useState, useEffect } from "react";
import {
  selectedAlbums,
  selectedIsLoading,
} from "../Redux/Dashboard_Redux/selector";
import { fetchAlbums } from "../Redux/Dashboard_Redux/thunk";
import { useCallDispatch, useSelectedValue } from "../Hooks/customHooks";
import SkeletonPhotos from "./SkeletonPhotos";

import { List, Map } from "immutable";
import { CreateAlbumDialog, ShowSinglePhoto } from "../Utils/designUtils";
import * as jwtDecode from "jwt-decode";
import { CircularProgress } from "@mui/material";

const Albums = () => {
  const [getAlbumsApi] = useCallDispatch(fetchAlbums);
  const [imageLoading, setImageLoading] = useState(Map({}));
  const [isLoading] = useSelectedValue(selectedIsLoading);
  const [albums] = useSelectedValue(selectedAlbums);
  const [openImage, setOpenImage] = useState(Map({ open: false, key: "" }));
  const decode = jwtDecode.jwtDecode(localStorage.getItem("token"));
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
    getAlbumsApi(decode.sub);
  }, []);

  return (
    <div className="flex flex-wrap gap-5 " style={{ marginTop: "40px" }}>
      <ShowSinglePhoto
        handleClose={handleCloseImage}
        open={openImage}
        isAlbum={true}
      />
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <CircularProgress size={60} />
        </div>
      )}
      {isLoading ? (
        <SkeletonPhotos />
      ) : (
        <>
          {albums.size <= 0 ? (
            <div className="flex justify-center h-[80vh] items-center w-full flex-col gap-4">
              <img
                className=" h-auto"
                src="https://www.gstatic.com/social/photosui/images/empty_state_albums_dark.svg"
              />
              <div className="text-1xl sm:text-2xl mx-10 text-white">
                The albums you create are shown here
              </div>
            </div>
          ) : (
            albums.map((value, index) => (
              <div className="flex flex-col   gap-2  w-86 " key={index}>
                <CreateAlbumDialog
                  title={value.get("title", "")}
                  photosIds={value.get("photoIds", List())}
                  createdAt={value.get("createdAt", "")}
                  handleOpenImage={handleOpenImage}
                >
                  {({ handleClickOpen }) => {
                    return (
                      <>
                        <img
                          onClick={handleClickOpen}
                          className={` h-auto w-90 mt-5 object-cover rounded ${
                            imageLoading.get(index, true) ? "hidden" : "block"
                          }`}
                          src={value.get("thumbnail", "")}
                          onLoad={() =>
                            setImageLoading((prev) => prev.set(index, false))
                          }
                        />
                        <>
                          {imageLoading.get(index, true) && (
                            <div
                              key={index}
                              className=" animate-pulse w-93 gap-4 flex justify-center flex-col max-w-sm rounded-md   p-4"
                            >
                              <div className="h-55 w-80 rounded bg-neutral-300"></div>
                            </div>
                          )}
                        </>
                      </>
                    );
                  }}
                </CreateAlbumDialog>

                <div className="flex flex-col  ">
                  <div className="text-neutral-300  font-bold">
                    {value.get("title", "")}
                  </div>
                  <div className="text-neutral-300 text-[12px]   self-start">
                    {value.get("photoIds", List()).size} items
                  </div>
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default Albums;
