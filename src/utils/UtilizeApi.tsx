import axios from "axios";
import { IRecommendedParams, IFetchTrackParams } from "../interfaces";

class HttpGetParams {
  constructor(
    public readonly params: IRecommendedParams | IFetchTrackParams,
    public readonly token: string | null
  ) {}
}

const httpGet = async (url: string, params: HttpGetParams) => {
  const authHeaders = {
    Authorization: `Bearer ${params.token}`,
  };
  return axios.get(url, { headers: authHeaders, params: params.params });
};
const constructSearchUrl = (queryParams: string) =>
  `https://api.spotify.com/v1/${queryParams}`;

export { HttpGetParams, httpGet, constructSearchUrl };
