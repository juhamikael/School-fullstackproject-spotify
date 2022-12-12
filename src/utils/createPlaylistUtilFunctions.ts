import {IBookmarks} from "../interfaces";
import {toast} from "react-toastify";
import {constructSearchUrl, HttpGetUserProfileParams, HttpPostParams} from "./UtilizeApi";

const isScrollable = () => {
    return document.body.scrollHeight <= document.body.clientHeight;
}

const getFormattedDate = (date: Date) => {
    return date.getDate() +
      "/" +
      (date.getMonth() + 1) +
      "/" +
      date.getFullYear() +
      " - " +
      (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
      ":" +
      (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
      ":" +
      (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
}


const CreateSongUriString = () => {
    const bookmarks = window.localStorage.getItem("bookmarks");
    const trackUris = bookmarks
      // @ts-ignore
      ? Object.values(JSON.parse(bookmarks)).map((track) => track.uri)
      : [];
    return trackUris.join(",");
}

const returnLoggedInStatusBoolean = () => {
    const loggedInStatus = window.localStorage.getItem("loggedInStatus");
    if (loggedInStatus !== "True") {
        return true;
    }
    return false;
}

const returnBookmarksFromLocalStorage = () => {
    const bookmarks = window.localStorage.getItem("bookmarks");
    return bookmarks ? JSON.parse(bookmarks) : {};
}

const removeFromBookmarkList = (track: IBookmarks, bookmarkList: any) => {
    const id = track.id;
    if (bookmarkList[id] !== undefined) {
        const {[id]: value, ...rest} = bookmarkList;
        toast.info(`"${track.artists} - ${track.title}" removed from bookmarks!`);
        return rest;
    }
    return bookmarkList;
};

const trackIdClicked = (bookmark: IBookmarks) => {
    window.scrollTo(0, 0);
    window.localStorage.setItem("trackId", bookmark.id);
    window.localStorage.setItem("searchQuery", bookmark.id);
    const currentTrack = bookmark.artists + " - " + bookmark.title;
    window.localStorage.setItem("currentTrack", currentTrack);

    navigator.clipboard.writeText(bookmark.id).then(r => toast.success(
      `"${bookmark.artists} - ${bookmark.title}" copied to clipboard!`
    ));
    return bookmark.id;
};

const CreatePlaylistParams = () => {
    // Get user id from local storage
    const USER_ID = JSON.parse(window.localStorage.getItem("user") || "");

    // Get user access token from local storage
    const TOKEN = window.localStorage.getItem("token");

    // Get user profile from local storage
    const HTTP_GET: HttpGetUserProfileParams = new HttpGetUserProfileParams(
      window.localStorage.getItem("token")
    );

    // Construct post url for playlist
    const CREATE_PLAYLIST = constructSearchUrl(
      "users/" + USER_ID + "/playlists"
    );

    // Get formatted date which is used for playlist name
    const formattedDate = getFormattedDate(new Date());
    // Default playlist name
    let PLAYLIST_NAME = ` Recommendations - ${formattedDate} - EDIT ME!`;

    let REQUEST_BODY = {
        // Define playlist post request body
        name: PLAYLIST_NAME,
        description: "Playlist created with 'Spotify Recommendations' app",
        public: false,
    };
    const postParams = new HttpPostParams(REQUEST_BODY, TOKEN);
    return { postParams, CREATE_PLAYLIST, HTTP_GET , PLAYLIST_NAME, TOKEN};
}


export {
    isScrollable,
    getFormattedDate,
    CreateSongUriString,
    returnLoggedInStatusBoolean,
    returnBookmarksFromLocalStorage,
    removeFromBookmarkList,
    trackIdClicked,
    CreatePlaylistParams
}