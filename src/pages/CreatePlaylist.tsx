import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomToast from "../components/CustomToast";
import ScrollButtons from "../components/ScrollButtons";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import SpotifyPlayer from "../components/SpotifyPlayer";
import {
    HttpPostParams,
    constructSearchUrl,
    httpPostPlaylist,
    httpGetPlaylist,
} from "../utils/UtilizeApi";
import {IBookmarks} from "../interfaces";
import {
    isScrollable,
    CreatePlaylistParams,
    CreateSongUriString,
    returnLoggedInStatusBoolean,
    returnBookmarksFromLocalStorage,
    removeFromBookmarkList,
    trackIdClicked
} from "../utils/createPlaylistUtilFunctions";

const CreatePlaylist = () => {
    const [siteScrollable, setSiteScrollable] = useState(false);
    const [bookmarkList, setBookmarkList] = useState(returnBookmarksFromLocalStorage());

    if (!returnLoggedInStatusBoolean()) {
        window.location.href = "/";
    }

    const [trackId, setTrackId] = useState(
      window.localStorage.getItem("trackId")
    );

    useEffect(() => {
        const searchQuery = window.localStorage.getItem("searchQuery");
        if (searchQuery !== null) {
            setTrackId(searchQuery);
        }
    }, []);

    const postPlaylist = () => {
        const {postParams, CREATE_PLAYLIST, HTTP_GET, PLAYLIST_NAME, TOKEN} = CreatePlaylistParams();
        httpPostPlaylist(CREATE_PLAYLIST, postParams)
          .then(() => {
              const getMyPlaylists = constructSearchUrl(`me/playlists`);
              httpGetPlaylist(getMyPlaylists, HTTP_GET).then((response) => {
                  const playlistID = response.data.items[0].id;
                  const trackUris = CreateSongUriString();
                  const POST_TRACKS = constructSearchUrl(
                    "playlists/" + playlistID + "/tracks?uris=" + trackUris
                  );
                  const TrackParams = new HttpPostParams({uris: trackUris}, TOKEN);
                  httpPostPlaylist(POST_TRACKS, TrackParams).then(() => {
                      window.localStorage.setItem("bookmarks", JSON.stringify({}));
                      setBookmarkList({});
                  });
                  toast.success(`Playlist ' ${PLAYLIST_NAME} ' created!`);
              });
          });
    };

    const bookmarkRemoveHandler = (track: IBookmarks) => {
        setBookmarkList(removeFromBookmarkList(track, bookmarkList));
    }

    const trackIdClickHandler = (bookmark: IBookmarks) => {
        setTrackId(trackIdClicked(bookmark));
    }

    useEffect(() => {
        setSiteScrollable(isScrollable());
        window.localStorage.setItem("bookmarks", JSON.stringify(bookmarkList));
    }, [bookmarkList]);

    return (
      <div>
          <CustomToast location={"bottom-center"}/>
          <div className="flex justify-center">
              <button
                onClick={postPlaylist}
                className="btn h-8 mt-5 w-9/12 btn-active bg-cyan-500 text-white hover:bg-cyan-700 rounded-2xl"
              >
                  Create playlist
              </button>
          </div>
          <div className="flex justify-center mt-5">
              <SpotifyPlayer trackID={trackId} width="75" height="80"/>
          </div>

          <div className="mt-12">
              <div className="table-container flex justify-center">
                  <table className="table-fixed w-9/12 text-left ">
                      <thead>
                      <tr>
                          <th>Artists</th>
                          <th>Title</th>
                          <th>ID</th>
                          <th className="w-1/12"></th>
                      </tr>
                      </thead>
                      <tbody>
                      {Object.keys(bookmarkList).map((key) => (
                        <tr key={key} className="text-left odd:bg-gray-100/5">
                            <td>{bookmarkList[key].artists}</td>
                            <td>{bookmarkList[key].title}</td>
                            <td>
                                {/*If user clicks this, copy it to clipboard */}
                                <button
                                  className="text-cyan-300 hover:text-blue-700"
                                  onClick={() => {
                                      trackIdClickHandler(bookmarkList[key]);
                                  }}
                                >
                                    {bookmarkList[key].id}
                                </button>
                            </td>
                            <td>
                                <button
                                  // Delete bookmark
                                  className="mr-5 p-3 float-right bg-transparent border-0 hover:bg-transparent "
                                  onClick={() => bookmarkRemoveHandler(bookmarkList[key])}
                                >
                                    <FontAwesomeIcon
                                      className="h-4 w-4 text-cyan-300"
                                      icon={faTrash}
                                    />
                                </button>
                            </td>
                        </tr>
                      ))}
                      </tbody>
                  </table>
              </div>
              {!siteScrollable ? (<ScrollButtons/>) : (<></>)}
          </div>
      </div>
    );
};
export default CreatePlaylist;
