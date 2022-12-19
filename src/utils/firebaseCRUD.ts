import { db } from "../firebase";
import { get, ref, set, update } from "firebase/database";
import { ITrack } from "../interfaces";

export const writeToDatabase = (track: ITrack) => {
  update(ref(db, "tracks/"), {
    [track.id]: track,
  })
    .then((r) =>
      console.log(
        `Track "${track.artist} - ${track.trackName}" added to database!`
      )
    )
    .then(() => {
      getTracksFromDatabase().then((response: any) => {
        let randomTrackIds: string[] = [];
        response.map((track: { id: string }) => {
          randomTrackIds.push(track.id);
        });
        localStorage.setItem("randomSongs", JSON.stringify(response));
        localStorage.setItem("randomTrackIDS", JSON.stringify(randomTrackIds));
      });
    });
};

export const getDatabaseSize = async () => {
  const tracks = await get(ref(db, "tracks/"));
  return Object.keys(tracks.val()).length;
};

export const getTracksFromDatabase = async () => {
  // Get all tracks from database
  const tracks = await get(ref(db, "tracks/"));
  const size = Object.keys(tracks.val()).length;
  if (size > 5) {
    // If there are more than 5 tracks in database, get 5 random tracks
    const keys = Object.keys(tracks.val())
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
    return keys.map((key) => tracks.val()[key]);
  } else {
    return Object.values(tracks.val());
  }
};

const getUserIdentifier = (user: string) => {
  const notAllowedChars = [".", "#", "$", "[", "]"];
  let userIdentifier = user;
  notAllowedChars.forEach((char) => {
    if (userIdentifier.includes(char)) {
      userIdentifier = userIdentifier.replace(char, "");
    }
  });
  return userIdentifier;
};

export const storeUserDataInDatabase = async () => {
  const bookmarks = window.localStorage.getItem("bookmarks");
  const user = JSON.parse(window.localStorage.getItem("user") || "");

  let userIdentifier = getUserIdentifier(user);
  const userData = {
    isLoggedIn: false,
    bookmarks: bookmarks,
  };

  set(ref(db, `users/${userIdentifier}`), userData);
};

export const getUserDataFromDatabase = async () => {
  const user = JSON.parse(window.localStorage.getItem("user") || "");
  let userIdentifier = getUserIdentifier(user);
  updateIsLoggedIn(userIdentifier);
  const userData = await get(ref(db, `users/${userIdentifier}`));
  return userData.val();
};

// Update firebase "isLoggedIn" if user is logged in
export const updateIsLoggedIn = async (user: string) => {
  update(ref(db, `users/${user}`), {
    isLoggedIn: true,
  });
};
