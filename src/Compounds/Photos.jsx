import React, { Fragment, useCallback, useEffect, useState } from "react";
import {
  deleteSinglePhoto,
  fetchPhotos,
  getSingedUrl,
} from "../Redux/Dashboard_Redux/thunk";
import {
  selectedCreation,
  selectedIsLoading,
  selectedPhotos,
} from "../Redux/Dashboard_Redux/selector";
import {
  useBooleanHook,
  useCallDispatch,
  useGetApiData,
  useSelectedValue,
} from "../Hooks/customHooks";
import defaultImage from "../assets/defaut.png";
import moment from "moment/moment";
import { fromJS, List, Map } from "immutable";
import * as jwt_decode from "jwt-decode";
import { Checkbox, CircularProgress, Dialog } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { setData } from "../Redux/Dashboard_Redux/reducer";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import useEmblaCarousel from "embla-carousel-react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";

function collectAllImagesFromTree(tree) {
  const result = [];
  const data = typeof tree.toJS === "function" ? tree.toJS() : tree;
  function traverse(node) {
    if (Array.isArray(node) && typeof node[0] !== "string") {
      result.unshift(...node);
    } else if (typeof node === "object" && node !== null) {
      for (const key in node) {
        traverse(node[key]);
      }
    }
  }
  traverse(data);
  return result;
}

function nestPhotos(data) {
  const result = { next: [] };
  for (const group of data) {
    const { year, month, day, hourSlot } = group.get("_id", Map()).toJS();
    if (!result[year]) {
      result[year] = { next: [] };
      result["next"].push(`${year}`);
    }
    if (!result[year][month]) {
      result[year][month] = { next: [] };
      result[year]["next"].push(`${year}+${month}`);
    }
    if (!result[year][month][day]) {
      result[year][month][day] = {
        next: [],
      };
      result[year][month]["next"].push(`${year}+${month}+${day}`);
    }
    if (!result[year][month][day][hourSlot]) {
      result[year][month][day][hourSlot] = [];
      result[year][month][day][hourSlot].push(...group.get("photos", List()));
      result[year][month][day]["next"].push(
        `${year}+${month}+${day}+${hourSlot}`
      );
    }
  }
  return result;
}

const Photos = () => {
  const decode = jwt_decode.jwtDecode(localStorage.getItem("token"));
  const [setRedux] = useCallDispatch(setData);
  const [photos, setPhotos] = useState(List([]));
  const [openSlider, setOpenSlider] = useBooleanHook(false);
  const [keyList, setKeyList] = useState(List([]));
  const [data] = useGetApiData(selectedPhotos, fetchPhotos, {
    userId: decode.sub,
  });
  const [getPhotosApi] = useCallDispatch(fetchPhotos);
  const [imageLoading, setImageLoading] = useState(Map());
  const [isLoading] = useSelectedValue(selectedIsLoading);
  const [creation] = useSelectedValue(selectedCreation);
  const [searchParams, setSearchParams] = useSearchParams();
  const [reduxData] = useCallDispatch(setData);
  const [imageCollections, setImageCollections] = useState(List([]));
  const handleCloseSlider = (index) => {
    setOpenSlider(!openSlider);
    setSearchParams({ index });
    getPhotosApi({ userId: decode.sub });
  };
  useEffect(() => {
    setPhotos(fromJS(nestPhotos(data)));
  }, [data]);

  const handleCreation = (id, event) => {
    const checked = event.target.checked;
    if (!checked) {
      const findIndex = creation.findIndex((value) => value === id);
      return reduxData(fromJS({ creation: creation.delete(findIndex) }));
    }
    reduxData(
      fromJS({
        creation: [...creation, id],
      })
    );
  };

  useEffect(() => {
    setRedux(fromJS({ creation }));
  }, [creation]);

  useEffect(() => {
    setImageCollections(fromJS(collectAllImagesFromTree(photos)));
  }, [photos]);

  return (
    <Fragment>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <CircularProgress size={60} />
        </div>
      )}
      {openSlider && (
        <ImageSlider
          open={openSlider}
          handleClose={handleCloseSlider}
          data={imageCollections}
          setImageCollections={setImageCollections}
        />
      )}
      <div className="flex  flex-wrap gap-15  " style={{ marginTop: "40px" }}>
        {isLoading ? (
          <div
            role="status"
            className="w-full flex justify-center items-center h-[85vh]"
          >
            <svg
              aria-hidden="true"
              class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
            <span class="sr-only">Loading...</span>
          </div>
        ) : (
          <>
            {photos.get("next", List()).size === 0 ? (
              <div className="flex justify-center h-[80vh] items-center w-full flex-col gap-4">
                <img
                  className=" h-auto"
                  src="https://www.gstatic.com/social/photosui/images/state/empty_state_photos_646x328dp.svg"
                />
                <div className="text-1xl sm:text-2xl mx-10 text-white">
                  Ready to add some photos?
                </div>
              </div>
            ) : (
              photos.get("next", List()).map((nextKey, index) => {
                return (
                  <div key={index}>
                    <div className="text-2xl">{nextKey}</div>
                    <PhotoListCompound
                      data={photos.getIn(nextKey.split("+"), Map())}
                      next={photos
                        .getIn(nextKey.split("+"), Map())
                        .get("next", List())}
                      photos={photos}
                      searchParams={searchParams}
                      imageLoading={imageLoading}
                      setImageLoading={setImageLoading}
                      handleCloseSlider={handleCloseSlider}
                      setKeyList={setKeyList}
                      handleCreation={handleCreation}
                    />
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </Fragment>
  );
};

export default Photos;

const PhotoListCompound = ({
  data,
  next,
  photos,
  imageLoading,
  setImageLoading,
  handleClickOpen,
  handleCloseSlider,
  setKeyList,
  handleCreation,
}) => {
  const [searchParams] = useSearchParams();
  const title = searchParams.get("title");
  if (!List.isList(next)) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {next.map((nextKey, nextIndex) => {
        const splitNext = nextKey.split("+");
        const current = photos.getIn(splitNext, Map());
        if (List.isList(current)) {
          setKeyList((prev) =>
            prev.includes(nextKey) ? prev : prev.push(nextKey)
          );
          return (
            <Fragment key={nextIndex}>
              <div className="flex flex-col flex-wrap gap-2 ">
                <div className="text-1xl" style={{ paddingTop: "30px" }}>
                  {formatTimeRange(nextKey)}
                </div>
                <div className="flex flex-wrap gap-x-2 gap-y-5">
                  {current.map((photo, index) => (
                    <div key={index}>
                      <div className="flex flex-wrap gap-1 ">
                        <div className="flex flex-col w-full  relative">
                          <div className="absolute z-10 right-0">
                            {title && (
                              <Checkbox
                                sx={{
                                  color: "white",
                                  p: 0.5,
                                  "& .MuiSvgIcon-root": {
                                    fontSize: 22,
                                    borderRadius: "50%",
                                    transition: "all 0.2s ease-in-out",
                                  },
                                  "&.Mui-checked": {
                                    color: "#1976d2",
                                  },
                                  "&:hover": {
                                    backgroundColor: "transparent",
                                  },
                                }}
                                disableRipple
                                onClick={(event) =>
                                  handleCreation(photo.get("_id", ""), event)
                                }
                              />
                            )}
                          </div>
                          <img
                            onClick={() => handleCloseSlider(index)}
                            className={`w-full h-auto sm:h-55  max-w-full object-cover ${
                              imageLoading.get(index, true) ? "hidden" : "block"
                            }`}
                            src={photo.get("thumbnailUrl", defaultImage)}
                            alt={defaultImage}
                            onLoad={() =>
                              setImageLoading((prev) => prev.set(index, false))
                            }
                          />
                          {imageLoading.get(index, true) && (
                            <div className="animate-pulse w-93 gap-4 flex justify-center flex-col max-w-sm rounded-md p-4">
                              <div className="h-65 w-full  bg-neutral-300"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Fragment>
          );
        } else {
          return (
            <PhotoListCompound
              key={nextIndex}
              data={current}
              next={current.get("next", List())}
              photos={photos}
              imageLoading={imageLoading}
              setImageLoading={setImageLoading}
              handleClickOpen={handleClickOpen}
              handleCloseSlider={handleCloseSlider}
              setKeyList={setKeyList}
              handleCreation={handleCreation}
            />
          );
        }
      })}
    </div>
  );
};

function formatTimeRange(dateKey) {
  const [year, month, day, range] = dateKey.split("+");
  const [startHour, endHour] = range.split("-");
  const start = moment(`${year}-${month}-${day} ${startHour}`, "YYYY-M-D HH");
  const end = moment(`${year}-${month}-${day} ${endHour}`, "YYYY-M-D HH");
  return `${start.format("ddd, MMM D, YYYY h:mm A")} to ${end.format(
    "h:mm A"
  )}`;
}

export const ImageSlider = ({
  open,
  handleClose,
  data = List([]),
  setImageCollections,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(false);
  const [imageLoading, setImageLoading] = useState(Map());
  const [imageIndex, setImageIndex] = useState(0);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("index"))
      setImageIndex(Number(searchParams.get("index")));
  }, [searchParams]);

  const scrollPrev = () => {
    setImageIndex((prev) => prev - 1);
    return emblaApi && emblaApi.scrollPrev();
  };
  const scrollNext = () => {
    setImageIndex((prev) => prev + 1);
    return emblaApi && emblaApi.scrollNext();
  };

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevDisabled(!emblaApi.canScrollPrev());
    setNextDisabled(!emblaApi.canScrollNext());
    setImageIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const [deleteImageApi] = useCallDispatch(deleteSinglePhoto);

  const deleteImageCallBack = (index) => () => {
    setImageCollections((prev) => prev.delete(index));
    setImageIndex((prev) => prev + 1);
    emblaApi.on("reInit", () => {
      emblaApi.scrollTo(index + 1);
      onSelect();
    });
  };

  const handleDeleteImage = (_id, userId, index) => {
    deleteImageApi({ _id, userId, callBack: deleteImageCallBack(index) });
  };

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const [signedUrl] = useCallDispatch(getSingedUrl);
  const callBack = (url) =>
    setImageLoading((prev) => prev.setIn([imageIndex, "url"], url));

  useEffect(() => {
    setImageLoading((prev) => prev.setIn([imageIndex, "url"], ""));
    signedUrl({
      key: data.getIn([imageIndex, "key"], ""),
      callBack,
    });
  }, [imageIndex, data]);

  useEffect(() => {
    return () => setImageLoading((prev) => prev.setIn([imageIndex, "url"], ""));
  }, []);

  return (
    <>
      <Dialog fullScreen open={open} sx={{ zIndex: 1301 }}>
        <div className="relative  bg-black">
          <div className="overflow-hidden " ref={emblaRef}>
            <div className="flex">
              {data.map((value, index) => (
                <div
                  className="min-w-full h-dvh flex-[0_0_100%] p-4"
                  key={index}
                >
                  <div className="flex  justify-between">
                    <ArrowBackIcon
                      className="text-white cursor-pointer"
                      size={30}
                      sx={{ margin: "15px" }}
                      onClick={handleClose}
                    />

                    <DeleteIcon
                      className="text-white cursor-pointer"
                      sx={{ margin: "15px" }}
                      size={30}
                      onClick={() =>
                        handleDeleteImage(
                          value.get("_id", ""),
                          value.get("userId", ""),
                          index
                        )
                      }
                    />
                  </div>
                  <div className="flex h-[90%] items-center justify-center text-xl font-bold">
                    <img
                      src={imageLoading.getIn([imageIndex, "url"], "")}
                      alt="preview"
                      onLoad={() =>
                        setImageLoading((prev) =>
                          prev.setIn([imageIndex, "isLoading"], false)
                        )
                      }
                      className={`max-w-screen max-h-screen object-contain rounded-xl shadow-xl ${
                        imageLoading.getIn([imageIndex, "isLoading"], true)
                          ? "hidden"
                          : "block"
                      }`}
                    />
                    {imageLoading.getIn([imageIndex, "isLoading"], true) && (
                      <CircularProgress size="30px" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {!prevDisabled && (
            <button
              onClick={scrollPrev}
              className="absolute text-amber-50 top-1/2 left-4 -translate-y-1/2 z-10"
            >
              <ArrowBackIosIcon />
            </button>
          )}
          {!nextDisabled && (
            <button
              onClick={scrollNext}
              className="absolute text-amber-50 top-1/2 right-4 -translate-y-1/2 z-10"
            >
              <ArrowForwardIosIcon />
            </button>
          )}
        </div>
      </Dialog>
    </>
  );
};
