import axios from "axios";
import {
  IRecommendedParams,
  IFetchTrackParams,
  IPostPlaylist,
  IPostTracks,
} from "../interfaces";

const constructSearchUrl = (queryParams: string) =>
  // Default: https://api.spotify.com/v1/
  // Parameter queryParams example: `tracks/${trackID}`
  // Returns: https://api.spotify.com/v1/tracks/${trackID}
  `https://api.spotify.com/v1/${queryParams}`;

class HttpGetUserProfileParams {
  // Constructor with readonly token
  constructor(public readonly token: string | null) {}
}

  class HttpGetParams {
    // Constructor with readonly params and token {IRecommendedParams | IFetchTrackParams}
    constructor(
      public readonly params: IRecommendedParams | IFetchTrackParams,
      public readonly token: string | null
    ) {}
  }

const httpGet = async (url: string, params: HttpGetParams) => {
  // HTTP Function for GET requests
  const authHeaders = {
    Authorization: `Bearer ${params.token}`,
  };
  return axios.get(url, { headers: authHeaders, params: params.params });
};

const httpGetUser = async (url: string, params: HttpGetUserProfileParams) => {
  // HTTP Function for getting user profile
  const authHeaders = {
    Authorization: `Bearer ${params.token}`,
  };
  return axios.get(url, { headers: authHeaders });
};

const httpGetPlaylist = async (url: string, params: HttpGetUserProfileParams) => {
  const authHeaders = {
    Authorization: `Bearer ${params.token}`,
  };
  return axios.get(url, { headers: authHeaders });
};

class HttpPostParams {
  constructor(
    public readonly params: IPostPlaylist | IPostTracks,
    public readonly token: string | null
  ) {}
}
const httpPostPlaylist = async (url: string, params: HttpPostParams) => {
  const authHeaders = {
    Authorization: `Bearer ${params.token}`,
  };
  return fetch(url, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify(params.params),
  });
};



export {
  HttpGetParams,
  HttpPostParams,
  HttpGetUserProfileParams,
  httpGet,
  httpGetUser,
  httpGetPlaylist,
  httpPostPlaylist,
  constructSearchUrl,
};
