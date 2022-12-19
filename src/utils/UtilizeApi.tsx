import axios from "axios";
import { getUserDataFromDatabase } from "./firebaseCRUD";
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

const httpGetPlaylist = async (
  url: string,
  params: HttpGetUserProfileParams
) => {
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

const GET_USER = async () => {
  const GET_CURRENT_USER = constructSearchUrl("me");
  // Fetch user ID from Spotify API and store it to local storage
  const HTTP_GET: HttpGetUserProfileParams = new HttpGetUserProfileParams(
    window.localStorage.getItem("token")
  );
  httpGetUser(GET_CURRENT_USER, HTTP_GET).then((response) => {
    window.localStorage.setItem("user", JSON.stringify(response.data.id));
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
  GET_USER
};
