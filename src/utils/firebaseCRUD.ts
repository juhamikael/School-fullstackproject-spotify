import {db,} from "../firebase";
import {get, ref, set, update,} from "firebase/database";
import {ITrack} from "../interfaces";
import * as crypto from 'crypto';

export const writeToDatabase = (track: ITrack) => {

    update(ref(db, 'tracks/'), {
        [track.id]: track
    }).then(r => console.log(`Track "${track.artist} - ${track.trackName}" added to database!`));
};

export const getTracksFromDatabase = async () => {
    // Get all tracks from database
    const tracks = await get(ref(db, 'tracks/'));

    // Get size of object
    const size = Object.keys(tracks.val()).length;
    if (size > 5) {
        // If there are more than 5 tracks in database, get 5 random tracks
        const keys = Object.keys(tracks.val()).sort(() => 0.5 - Math.random()).slice(0, 5);
        return keys.map(key => tracks.val()[key]);
    } else {
        return Object.values(tracks.val());
    }
};

export const storeTokenInDatabase = (token: string) => {

    set(ref(db, 'users/'), {
        [JSON.parse(window.localStorage.getItem("user") || "")]: {
            token: token
        }
    }).then(r => console.log(r));
}