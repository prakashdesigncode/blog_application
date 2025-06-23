import React, { useState } from "react";
import {
  selectedAlbums,
  selectedIsLoading,
} from "../Redux/Dashboard_Redux/selector";
import { fetchAlbums } from "../Redux/Dashboard_Redux/thunk";
import { useInfiniteScroll, useSelectedValue } from "../Hooks/customHooks";
import SkeletonPhotos from "./SkeletonPhotos";

import { List, Map } from "immutable";
import { CreateAlbumDialog, ShowSinglePhoto } from "../Utils/designUtils";
import * as jwtDecode from "jwt-decode";

const Albums = () => {
  const [infinite, isInterSecting] = useInfiniteScroll(
    selectedAlbums,
    fetchAlbums
  );
  const [imageLoading, setImageLoading] = useState(Map({}));
  const [isLoading] = useSelectedValue(selectedIsLoading);
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
  return (
    <div className="flex flex-wrap gap-10">
      <ShowSinglePhoto handleClose={handleCloseImage} open={openImage} />
      {isLoading ? (
        <SkeletonPhotos />
      ) : (
        infinite.map((value, index) => (
          <div
            className="flex flex-col   gap-2  w-86 "
            // ref={infinite.size - 1 === index ? isInterSecting : null}
            key={index}
          >
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
                      className={` h-60 w-90 mt-5 object-cover rounded ${
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
    </div>
  );
};

export default Albums;
