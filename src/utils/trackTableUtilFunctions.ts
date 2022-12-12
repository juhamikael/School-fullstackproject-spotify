import {IBookmarks} from "../interfaces";
import {toast} from "react-toastify";

export const addToBookmarkList = (track: IBookmarks, bookmarkList: any) => {
    const artists = track.artists
      // @ts-ignore
      .map((artist: { name: any }) => artist.name)
      .join(", ");

    // @ts-ignore
    if (bookmarkList[track.id] === undefined) {
        toast.success(`"${artists} - ${track.name}" added to bookmarks!`);
        return ({
            ...bookmarkList,
            [track.id]: {
                id: track.id,
                artists: artists,
                title: track.name,
                uri: track.uri,
            } as IBookmarks,
        });
    } else {
        toast.error(`"${artists} - ${track.name}" already in bookmarks!`);
        return bookmarkList;
    }
};
