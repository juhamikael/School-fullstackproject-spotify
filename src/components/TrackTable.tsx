
import { useState, useEffect } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { IBookmarks } from "../interfaces";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faTrash } from "@fortawesome/free-solid-svg-icons";

import CustomToast from "./CustomToast";
import SpotifyPlayer from "./SpotifyPlayer";
import ScrollButtons from "./ScrollButtons";

import { getTrackLength } from "../utils/fetchDataModifiers";
import { addToBookmarkList } from "../utils/trackTableUtilFunctions";

import { useNavigate } from "react-router-dom";

const TrackTable = ({ recommendations }: any) => {
  const navigate = useNavigate();
  localStorage.setItem("UPDATEPAGE", "false");
  const LOCAL_DATA = JSON.parse(
    localStorage.getItem("recommendations") || "{}"
  );
  const [trackData, setTrackData] = useState(LOCAL_DATA || recommendations);
  const [bookmarkList, setBookmarkList] = useState(
    JSON.parse(localStorage.getItem("bookmarks") || "{}")
  );

  const redirectToPlaylist = () => {
    navigate("/playlists");
  };

  // useEffect when updateState changes
  useEffect(() => {
    // if recommendations is empty, use localstorage
    if (recommendations.length === 0) {
      setTrackData(LOCAL_DATA);
    } else {
      setTrackData(recommendations);
    }
  }, [recommendations]);

  const addToBookmarksHandler = (track: IBookmarks, bookmarks: any) => {
    setBookmarkList(addToBookmarkList(track, bookmarks));
  };

  // UseEffect & Save bookmarkList to local storage
  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarkList));
  }, [bookmarkList]);

  const removeFromBookmarkList = (track: any) => {
    const id = track.id;
    // @ts-ignore
    if (bookmarkList[id] !== undefined) {
      // @ts-ignore
      const { [id]: value, ...rest } = bookmarkList;
      // @ts-ignore
      setBookmarkList(rest);
      toast.info(`"${track.artists} - ${track.title}" removed from bookmarks!`);
    }
  };
  const getLength = (obj: any) => {
    return Object.keys(obj).length;
  };

  // @ts-ignore
  return (
    <div>
      <CustomToast location="top-center" />
      {getLength(trackData) > 0 && (
        <div className="flex justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 w-max">
              {trackData.map((track: any) => (
                <div className="rounded-xl font-bold text-white text-center mt-5 bg-c-dark-1/50 border-2 border-white/30">
                  <div className="p-6 text-left">
                    {track.artists.map((artist: { name: string }) => (
                      <span className="text-white font-black text-[14px]">
                        {artist.name.replace(/[-,.]/g, "")}
                        {track.artists.indexOf(artist) <
                        track.artists.length - 1
                          ? " & "
                          : ""}
                      </span>
                    ))}
                    <button
                      className="float-right btn bg-transparent border-0 hover:bg-transparent"
                      onClick={() => addToBookmarksHandler(track, bookmarkList)}
                    >
                      <FontAwesomeIcon
                        className="h-6 w-6 text-cyan-300"
                        icon={faBookmark}
                      />
                    </button>
                    <br />
                    <span className="text-[12px] text-white/80">
                      {track.name}
                    </span>
                    <p className="text-[12px]">
                      {" "}
                      {getTrackLength(track.duration_ms)}
                    </p>

                    <div className="mt-5 bottom 0">
                      <SpotifyPlayer
                        trackID={track.id}
                        width={"100"}
                        height={"80"}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl font-bold text-white text-center mt-5 bg-c-dark-1/50 border-2 border-white/30 lg:w-full">
              <div className="mt-5 text-xl">Bookmarks</div>
              <button
                className="btn w-3/6 bg-cyan-300 text-black mt-3 hover:bg-cyan-500 rounded-2xl"
                onClick={redirectToPlaylist}
              >
                Create playlist
              </button>

              <div className="mt-5">
                {Object.keys(bookmarkList).map((key) => (
                  <div className=" border-b-2 border-white/20">
                    <div className="text-left ml-5 p-2 mt-1">
                      <div>
                        <span className="text-white text-xs text-[14px]">
                          {bookmarkList[key].artists} -{" "}
                          {bookmarkList[key].title}
                        </span>
                        <span>
                          <button
                            // Delete bookmark
                            className="mr-5 float-right bg-transparent border-0 hover:bg-transparent "
                            onClick={() =>
                              removeFromBookmarkList(bookmarkList[key])
                            }
                          >
                            <FontAwesomeIcon
                              className="h-4 w-4 text-cyan-300"
                              icon={faTrash}
                            />
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {getLength(trackData) !== 0 ? (
        <ScrollButtons/>) : (<> </>)}

    </div>
  );
};

export default TrackTable;
