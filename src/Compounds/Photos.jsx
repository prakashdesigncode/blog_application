import React, { useEffect, useState } from "react";
import { fetchPhotos } from "../Redux/Dashboard_Redux/thunk";
import {
  selectedIsLoading,
  selectedPhotos,
} from "../Redux/Dashboard_Redux/selector";
import {
  useCallDispatch,
  useInfiniteScroll,
  useSelectedValue,
} from "../Hooks/customHooks";
import defaultImage from "../assets/defaut.png";
import moment from "moment/moment";
import Skeleton from "./SkeletonPhotos";
import { fromJS, List, Map } from "immutable";
import { ShowSinglePhoto } from "../Utils/designUtils";
import * as jwt_decode from "jwt-decode";
import { Checkbox } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { setData } from "../Redux/Dashboard_Redux/reducer";

const Photos = () => {
  const decode = jwt_decode.jwtDecode(localStorage.getItem("token"));
  const [setRedux] = useCallDispatch(setData);
  const [creation, setCreation] = useState(Map({}));
  const [infinite, isInterSecting] = useInfiniteScroll(
    selectedPhotos,
    fetchPhotos,
    { userId: decode.sub }
  );
  const [open, setOpen] = useState(Map({ open: false, key: "" }));
  const handleClickOpen = (key, _id) =>
    setOpen((prev) =>
      prev
        .set("key", key)
        .set("open", true)
        .set("_id", _id)
        .set("userId", decode.sub)
    );
  const handleClose = () => setOpen((prev) => prev.set("open", false));
  const [imageLoading, setImageLoading] = useState(Map());
  const [isLoading] = useSelectedValue(selectedIsLoading);
  const [searchParams] = useSearchParams();

  const handleAlbum = (event, id) => {
    const { checked } = event.target;
    setCreation((prev) => {
      if (checked) prev = prev.set(id, id);
      else prev = prev.delete(id);
      return prev;
    });
  };

  useEffect(() => {
    setRedux(fromJS({ creation }));
  }, [creation]);

  return (
    <>
      <ShowSinglePhoto handleClose={handleClose} open={open} />
      <div className="flex  flex-wrap gap-15 mt-8 ">
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            {infinite.size === 0 ? (
              <div className="flex justify-center h-[80vh] items-center w-full flex-col gap-4">
                <img src="https://www.gstatic.com/social/photosui/images/state/empty_state_photos_646x328dp.svg" />
                <div className="text-2xl mx-10 text-white">
                  Ready to add some photos?
                </div>
              </div>
            ) : (
              infinite.map((value, index) => (
                <div
                  className="flex flex-col   w-86 "
                  ref={infinite.size - 1 === index ? isInterSecting : null}
                  key={index}
                >
                  <div className="flex justify-between items-center">
                    <div className="text-neutral-300 font-bold text-1xl mt-2 mx-3 self-start">
                      {moment(value.get("createdAt", "")).format(
                        "ddd, MMM D, YYYY"
                      )}
                    </div>
                    {searchParams.get("creation") && (
                      <Checkbox
                        disableRipple
                        sx={{ color: "grey" }}
                        checked={creation.has(value.get("_id", ""))}
                        onClick={(event) =>
                          handleAlbum(event, value.get("_id", ""))
                        }
                      />
                    )}
                  </div>
                  <img
                    onClick={() =>
                      handleClickOpen(
                        value.get("key", ""),
                        value.get("_id", "")
                      )
                    }
                    className={` h-60 w-90 object-cover rounded ${
                      imageLoading.get(index, true) ? "hidden" : "block"
                    }`}
                    src={value.get("thumbnailUrl", defaultImage)}
                    alt={defaultImage}
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
              ))
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Photos;
