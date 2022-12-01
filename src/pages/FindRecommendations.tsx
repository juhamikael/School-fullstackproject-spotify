import TrackTable from "../components/TrackTable";
import { useEffect, useState } from "react";

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
} from "../interfaces";

interface ISpotifyArtist {
  id: string;
  name: string;
}

interface IRecommendedTracks {
  trackID: string;
}

const FindRecommendations = (props: any) => {
  // States for multiple different types of data
  // Starts here
  const [audioFeatures, setAudioFeatures] = useState<IAudioFeatures>();
  const [trackData, setTrackData] = useState<ISpotifyTrack>();
  const [searchQuery, setSearchQuery] = useState("");
  const [genreData, setGenreData] = useState({ genres: "" });
  const [hasGenres, setHasGenres] = useState(false);
  const [validSpotifURI, setValidSpotifURI] = useState(false);
  const [fetchComplete, setFetchComplete] = useState(false);
  const [recommendations, setRecommendations] = useState(![]);
  // Ends here

  // Combining all the data into one object
  const trackDataObject = { ...trackData, ...audioFeatures, ...genreData };

  // Get token from local storage
  const token: string | null = window.localStorage.getItem("token");

  // Define new HttpGetParams object where we're using only the market parameter
  const params: HttpGetParams = new HttpGetParams({ market: "FI" }, token);

  // Function to fetch track data from Spotify API
  const modifySearchQuery = (e: any) => {
    let value = e.target.value; // Get value from input field
    let userInput: string = ""; // Define empty string to store user input
    console.log(typeof trackData);
    if (trackData) {
      // If trackData is defined, set userInput to searchQuery state
      userInput = searchQuery;
    }
    if (!value.startsWith("https://open.spotify.com/track/")) {
      // If value does not start with https://open.spotify.com/track/, set userInput to value
      userInput = value;
    } else {
      // Url is valid & parse spotify url to get only track id which is used to fetch track data
      setValidSpotifURI(true);
      userInput = value.split("/")[4].split("?")[0];
    }
    // Set searchQuery state to userInput
    setSearchQuery(userInput);
  };

  const searchTrackDataHandler = async (e: any) => {
    e.preventDefault();
    // Get trackdata & audio features from Spotify API
    await getAudioFeatures();
    await getTrackData();
  };

  useEffect(() => {
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
    // Run useEffect when trackDataObject changes
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

    const trackQueryParams: string = constructSearchUrl(
      `tracks/${searchQuery}`
    );
    httpGet(trackQueryParams, params).then((response) => {
      setTrackData({
        artist_name: response.data.artists
          .map((track_artist: any) => track_artist.name)
          .join(", "),
        artist_id: response.data.artists.map((artist: any) => artist.id),
        artist_id_string: response.data.artists
          .map((artist: any) => artist.id)
          .join(","),
        track_title: response.data.name,
        track_length: getTrackLength(response.data.duration_ms),
        track_id: response.data.id,
        image_url: response.data.album.images[0].url,
      });
      const artistIDString: string = response.data.artists
        .map((artist: any) => artist.id)
        .join(",");
      const ArtistQueryParams: string = constructSearchUrl(
        `artists?ids=${artistIDString}`
      );
      httpGet(ArtistQueryParams, params).then((response) => {
        const genres = response.data.artists.map(
          (artist: any) => artist.genres
        );
        const randomGenres = getRandomGenres(genres);
        setGenreData({ genres: randomGenres });
        if (randomGenres.length > 0) {
          // Some artists have no genres, so we need to check if there are any genres
          // If there are genres, set hasGenres state to true and use default genres for recommendations
          setHasGenres(true);
        }
      });
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
        const recommendedTracks = response.data.tracks.map((track: any) =>
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
        setFetchComplete(true);
      })
      .then(() => {
        // Then fetch track data from Spotify API
        httpGet(trackQueryParams, params).then((response) => {
          setRecommendations(response.data.tracks);
          setFetchComplete(true);
        });
      });
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
        <div className="mt-5">
          <TrackTable tracks={recommendations} />
        </div>
      </div>
    </>
  );
};

export default FindRecommendations;
