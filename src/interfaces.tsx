interface IRecommendedParams {
  market: string;
  limit: number;
  seed_artists: string;
  seed_genres: string;
  seed_tracks: string;
  min_danceability: number;
  max_danceability: number;
  min_tempo: number;
  max_tempo: number;
}

interface IFetchTrackParams {
  market: string;
}

interface ISpotifyTrack {
  artist_name: string;
  artist_id: [string];
  artist_id_string: string;
  track_id: string;
  track_title: string;
  track_length: string;
  image_url: string;
}
interface IAudioFeatures {
  track_tempo: number;
  danceability: string;
  min_danceability: number;
  max_danceability: number;
  min_tempo: number;
  max_tempo: number;
}

export type {
  ISpotifyTrack,
  IAudioFeatures,
  IRecommendedParams,
  IFetchTrackParams,
};
