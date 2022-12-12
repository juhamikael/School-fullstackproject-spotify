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

interface IUserID {
    user_id: string;
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

interface IPostPlaylist {
    name: string;
    description: string;
    public: boolean;
}

interface IPostTracks {
    uris: string;
}

interface IBookmarks {
    name: string;
    id: string;
    artists: string;
    title: string;
    uri: string;
}

interface ITrack {
    trackName: string,
    artist: string,
    id: string
    date: string,
}

export type {
    IPostPlaylist,
    ISpotifyTrack,
    IBookmarks,
    IAudioFeatures,
    IRecommendedParams,
    IFetchTrackParams,
    IUserID,
    IPostTracks,
    ITrack
};

