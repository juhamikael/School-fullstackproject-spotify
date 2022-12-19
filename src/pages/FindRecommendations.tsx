import TrackTable from "../components/TrackTable";
import { ChangeEvent, useEffect, useState } from "react";

import {
  // Importing Util functions
  getTrackLength,
  modifyDanceability,
  getRandomGenres,
  modifyTempo,
} from "../utils/fetchDataModifiers";

import {
  // Importing API Controller functions
  HttpGetParams,
  httpGet,
  constructSearchUrl,
} from "../utils/UtilizeApi";

import {
  // Importing Types
  IRecommendedParams,
  IAudioFeatures,
  ISpotifyTrack,
  ITrack,
} from "../interfaces";

import {
  writeToDatabase,
  getUserDataFromDatabase,
} from "../utils/firebaseCRUD";

import SpotifyPlayer from "../components/SpotifyPlayer";
import { getFormattedDate } from "../utils/createPlaylistUtilFunctions";

const getCurrentTrack = () => {
  // check if current track exists, return true / false
  const currentTrack = localStorage.getItem("currentTrack");
  if (currentTrack) {
    return true;
  } else {
    return false;
  }
};

const checkUpdatePage = () => {
  const updatePage = window.localStorage.getItem("UPDATEPAGE");
  if (updatePage === "true") {
    window.location.reload();
    window.localStorage.setItem("UPDATEPAGE", "false");
  }
};

const updateBookmarks = () => {
  const localBookmarks = window.localStorage.getItem("bookmarks");
  getUserDataFromDatabase().then((data) => {
    if (localBookmarks !== JSON.stringify({}) ) {
      window.localStorage.setItem("bookmarks", localBookmarks || "{}");
    }else if (data.bookmarks) {
      window.localStorage.setItem("bookmarks", data.bookmarks);
    } else {
      window.localStorage.setItem("bookmarks", JSON.stringify({}));
    }
  });
};

const FindRecommendations = () => {
  // States for multiple different types of data
  // Starts here
  const [audioFeatures, setAudioFeatures] = useState<IAudioFeatures>();
  const [trackData, setTrackData] = useState<ISpotifyTrack>();
  const [searchQuery, setSearchQuery] = useState("");
  const [genreData, setGenreData] = useState({ genres: "" });
  const [validSpotifURI, setValidSpotifyURI] = useState(false);
  const [fetchComplete, setFetchComplete] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(getCurrentTrack());
  const [randomIDs, setRandomIDs] = useState([]);
  const [firstTimeUpdate, setFirstTimeUpdate] = useState(true);
  const [userDataLoaded, setUserDataLoaded] = useState(
    window.localStorage.getItem("userDataLoaded") === "true"
  );

  
  useEffect(() => {
    checkUpdatePage();
  }, [firstTimeUpdate]);

  // Combining all the data into one object
  const trackDataObject = { ...trackData, ...audioFeatures, ...genreData };

  // Get token from local storage
  const token: string | null = window.localStorage.getItem("token");

  // Define new HttpGetParams object where we're using only the market parameter
  const params: HttpGetParams = new HttpGetParams({ market: "FI" }, token);

  // Function to fetch track data from Spotify API
  const modifySearchQuery = (e: ChangeEvent<HTMLInputElement>) => {
    // Get value from input field
    const value = e.target.value;

    // Define empty string to store user input
    let userInput = "";

    // If trackData is truthy, set userInput to the current value of searchQuery
    if (trackData) {
      userInput = searchQuery;
    }
    // Check if value starts with https://open.spotify.com/track/
    if (!value.startsWith("https://open.spotify.com/track/")) {
      // If value does not start with the above string, set userInput to value
      userInput = value;
    } else {
      // Url is valid
      // Parse spotify url to get only track id which is used to fetch track data
      setValidSpotifyURI(true);
      userInput = value.split("/")[4].split("?")[0];
    }
    // Set searchQuery state to userInput
    window.localStorage.setItem("searchQuery", userInput);
    setSearchQuery(userInput);
  };

  const searchTrackDataHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    updateBookmarks();
    // storeRandomSongsFromDatabase();
    setFetchComplete(false); // Set fetchComplete state to false at the beginning of the function
    setRandomIDs(JSON.parse(localStorage.getItem("randomTrackIDS") || "{}"));
    await new Promise((r) => setTimeout(r, 1500)); // Wait 1.5 seconds before fetching data
    setRecommendations([]); // Clear recommendations array
    await getAudioFeatures(); // Fetch audio features from Spotify API
    await getTrackData(); // Fetch track data from Spotify API
  };
  const checkLocalStorage = () => {
    // If searchQuery exists in local storage
    if (window.localStorage.getItem("searchQuery")) {
      // Set searchQuery state to value from local storage
      setSearchQuery(window.localStorage.getItem("searchQuery") || "");
      // Set validSpotifURI state to true so search button is enabled
      setValidSpotifyURI(true);
    } else {
      // Set searchQuery state to empty string
      // and validSpotifURI state to false so search button is disabled
      setSearchQuery("");
      setValidSpotifyURI(false);
    }
  };

  useEffect(() => {
    // Getting "Current Track" from local storage which type is string
    // Current track is the track that user is using to find recommendations
    // Current track is same as searchQuery , searchQuery is track id and current track is track "artists - title"
    checkLocalStorage();
    setCurrentTrack(getCurrentTrack());
  }, [currentTrack]);
  // When page is loaded, reload page twice to make sure that all the data is loaded

  useEffect(() => {
    updateBookmarks();
    if (userDataLoaded === false) {
      setTimeout(() => {
        window.location.reload();
        window.localStorage.setItem("userDataLoaded", "true");
        setUserDataLoaded(true);
      }, 1000);
    }
  }, [userDataLoaded]);

  useEffect(() => {
    if (!trackData) {
      // If trackData state is empty
      return;
    } else {
      // If searchQuery state is stored in local storage, set searchQuery state to local storage value and set validSpotifURI to true
      if (window.localStorage.getItem("searchQuery") !== null) {
        setSearchQuery(window.localStorage.getItem("searchQuery") || "");
        setValidSpotifyURI(true);
      }
      // If url is valid
      if (validSpotifURI) {
        // and fetch is not complete
        if (!fetchComplete) {
          // Fetch recommendations
          getRecommendations().then((r) => {
            console.log("Fetched recommendations");
          });
        }
      }
    }
  }, [trackDataObject]);

  const getAudioFeatures = async () => {
    // Get audio features from Spotify API and define search url
    const queryParams: string = constructSearchUrl(
      `audio-features/${searchQuery}`
    );
    httpGet(queryParams, params).then((response) => {
      // Modify tempo to get min & max values
      const tempo = modifyTempo(response.data.tempo);

      // Set audio features state
      setAudioFeatures({
        track_tempo: response.data.tempo,
        danceability:
          (response.data.danceability * 100).toFixed(2).toString() + "%",
        min_danceability: modifyDanceability(response.data.danceability)
          .minDanceability,
        max_danceability: modifyDanceability(response.data.danceability)
          .maxDanceability,
        min_tempo: tempo.minTempo,
        max_tempo: tempo.maxTempo,
      });
    });
  };

  const getTrackData = async () => {
    // Fetch track data from Spotify API and define search url
    // Track data & Artists data is needed to fetch same time for easier state control
    // This way we can use artistids from track to fetch genres which is required for recommendations
    let searchQuery = window.localStorage.getItem("searchQuery");

    const trackQueryParams: string = constructSearchUrl(
      `tracks/${searchQuery}`
    );
    // Get all artists from track and join them with comma
    httpGet(trackQueryParams, params)
      .then((response) => {
        const artists = response.data.artists
          .map((track_artist: { name: string }) => track_artist.name)
          .join(", ");

        // Set track data state
        setTrackData({
          artist_name: artists,
          artist_id: response.data.artists.map(
            (artist: { id: number }) => artist.id
          ),
          artist_id_string: response.data.artists
            .map((artist: { id: number }) => artist.id)
            .join(","),
          track_title: response.data.name,
          track_length: getTrackLength(response.data.duration_ms),
          track_id: response.data.id,
          image_url: response.data.album.images[0].url,
        });

        // Get artist ids from track and join them with comma
        const artistIDString: string = response.data.artists
          .map((artist: { id: number }) => artist.id)
          .join(",");

        // Create new track object which is used to POST to Firebase
        const track: ITrack = {
          artist: artists,
          trackName: response.data.name,
          id: response.data.id,
          date: getFormattedDate(new Date()),
        };

        localStorage.setItem("trackToDatabase", JSON.stringify(track));

        // Set current track to local storage
        window.localStorage.setItem(
          "currentTrack",
          artists + " - " + response.data.name
        );

        const ArtistQueryParams: string = constructSearchUrl(
          `artists?ids=${artistIDString}`
        );
        // Fetch artist data from Spotify API
        httpGet(ArtistQueryParams, params).then((response) => {
          // Get genres from artist data
          const genres = response.data.artists.map(
            (artist: { genres: string }) => artist.genres
          );
          // Get random genres from genres array of arrays
          const randomGenres = getRandomGenres(genres);
          // Set genres state
          setGenreData({ genres: randomGenres });
        });
      })
      .then(() => {
        // LocalStorga get "TrackToDatabase" which is track object
        const trackToDatabase = JSON.parse(
          localStorage.getItem("trackToDatabase") || "{}"
        );
        writeToDatabase(trackToDatabase);
      });
  };
  const getRecommendations = async () => {
    const recommendedParams: HttpGetParams = new HttpGetParams(
      {
        // Define parameters for recommendations, data is used from trackDataObject
        market: "FI",
        limit: 12,
        seed_artists: trackDataObject.artist_id_string,
        seed_genres: trackDataObject.genres,
        seed_tracks: trackDataObject.track_id,
        min_danceability: trackDataObject.min_danceability,
        max_danceability: trackDataObject.max_danceability,
        min_tempo: trackDataObject.min_tempo,
        max_tempo: trackDataObject.max_tempo,
      } as IRecommendedParams,
      token
    );

    const queryParams: string = constructSearchUrl(`recommendations`); // Define search url for recommendations
    let trackQueryParams: string;

    httpGet(queryParams, recommendedParams)
      // Fetch recommendations from Spotify API
      .then((response) => {
        // Get multiple track ids from recommendations and store them to array
        // @ts-ignore
        const recommendedTracks = response.data.tracks.map((track) =>
          track.external_urls.spotify.split("/")[4].split("?")
        );
        // Map previously defined array to get track ids and make it one long string
        const recommendedTracksString = recommendedTracks
          .map((track: any) => track[0])
          .join(",");
        // And finally define search url for tracks by using track ids
        trackQueryParams = constructSearchUrl(
          `tracks?ids=${recommendedTracksString}`
        );
        // Set fetchComplete state to true
        // Probably not required tho, might prevent infinite loop
      })
      .then(() => {
        // Then fetch track data from Spotify API
        httpGet(trackQueryParams, params).then((response) => {
          setRecommendations(response.data.tracks);
          // Store recommendations to local storage
          localStorage.setItem(
            "recommendations",
            JSON.stringify(response.data.tracks)
          );
          setFetchComplete(true);
          window.localStorage.setItem("UPDATEPAGE", "true");
          setFirstTimeUpdate(false);
        });
      });
  };
  const randomIDClickHandler = (id: any) => {
    localStorage.setItem("trackId", id);
    localStorage.setItem("searchQuery", id);
    setValidSpotifyURI(true);
    setCurrentTrack(id);
  };

  return (
    <>
      <div>
        <div className="flex justify-center">
          <div className="mt-[5vw]">
            <form>
              <div className="flex justify-center text-base font-bold text-white font-exo ">
                {" "}
                Please insert valid Spotify track URL
              </div>
              <br />
              <input
                onChange={(e) => modifySearchQuery(e)}
                value={searchQuery}
                onSubmit={searchTrackDataHandler}
                placeholder="TRACK URL"
                className="rounded-md h-10 bg-white/10 font-medium text-sm text-white font-exo text-center border-2 border-white/20 focus:outline-none placeholder:text-/80 "
              />
              <button
                disabled={!validSpotifURI}
                onClick={searchTrackDataHandler}
                className="btn ml-5 h-8 w-20 btn-active bg-cyan-500 text-white hover:bg-cyan-700"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {!currentTrack ? (
          <></>
        ) : (
          <>
            <div>
              <p className="flex justify-center text-2xl mt-5 mb-5">
                If you use random IDs, click search button twice to get correct
                recommendations
              </p>
              {randomIDs.map((id) => (
                <div className=" mt-2 flex justify-center">
                  <button
                    className="text-white hover:animate-pulse hover:text-cyan-300 "
                    onClick={() => randomIDClickHandler(id)}
                  >
                    {" "}
                    {id}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-center mb-10 mt-10">
              <SpotifyPlayer trackID={searchQuery} height={"80"} width={"75"} />
            </div>
            <div className="mt-5">
              <TrackTable recommendations={recommendations} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default FindRecommendations;
