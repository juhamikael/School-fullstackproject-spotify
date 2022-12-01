import Spotify from "react-spotify-embed";
import { useState } from "react";
import { getTrackLength } from "../utils/fetchDataModifiers";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IBookmarks {
  id: string;
  artists: string;
  title: string;
}

const TrackTable = ({ tracks }) => {
  const [trackData, setTrackData] = useState();
  if (trackData === undefined && tracks.length > 0) {
    setTrackData(tracks);
  }

  const [bookmarkList, setBookmarkList] = useState({} as IBookmarks);

  const addToBookmarkList = (track: any) => {
    const artists = track.artists.map((artist) => artist.name).join(", ");
    // Avoid duplicates
    if (bookmarkList[track.id] === undefined) {
      setBookmarkList({
        ...bookmarkList,
        [track.id]: {
          id: track.id,
          artists: artists,
          title: track.name,
        },
      });
    }else{
      // React toast WIP
    }

  };

  return (
    <div>
      {console.log(bookmarkList)}
      {trackData !== undefined && (
        <div className="flex justify-center">
          <div className="grid lg:grid-cols-2 gap-10 sm:grid-cols-1">
            <div className="grid-cols-1 lg:grid-cols-2 gap-2 grid w-max">
              {trackData.map((track) => (
                <div className="rounded-xl font-bold text-white text-center mt-5 bg-c-dark-1/50 border-2 border-white/30">
                  <div className="p-6 text-left">
                    {track.artists.map((artist) => (
                      <span className="text-white font-black text-[14px]">
                        {artist.name.replace(/[-,.]/g, "")}
                        {track.artists.indexOf(artist) <
                        track.artists.length - 1
                          ? " & "
                          : ""}
                      </span>
                    ))}
                    <button
                      className="float-right"
                      onClick={() => addToBookmarkList(track)}
                    >
                      <FontAwesomeIcon className="h-6 w-6" icon={faBookmark} />
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
                      <Spotify
                        link={track.external_urls.spotify}
                        className="w-11/12 border-2 border-white relative bottom-0"
                        height={85}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl font-bold text-white text-center mt-5 bg-c-dark-1/50 border-2 border-white/30 lg:w-7/12 sm:w-max">
              <div className="mt-5">
                {Object.keys(bookmarkList).map((key) => (
                  <div className=" border-b-2 border-white/20">
                    <div className="text-left ml-5 p-2 mt-1">
                      <div>
                        <span className="text-cyan-300 font-black text-[14px]">
                          {bookmarkList[key].artists} -{" "}
                          {bookmarkList[key].title}
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
    </div>
  );
};

export default TrackTable;
