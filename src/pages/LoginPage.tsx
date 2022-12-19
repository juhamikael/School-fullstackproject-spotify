import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { GET_USER } from "../utils/UtilizeApi";
// It isn't best practice to use ":any" type but it is what it is, using it for now.
const LoginPage = () => {
  const [hasToken, setHasToken] = useState(false);
  const CLIENT_ID = "affcac7cf94f421abae557aea6dddc15";
  // Dev REDIRECT_URI
  // const REDIRECT_URI = "http://127.0.0.1:5173/";
  const REDIRECT_URI = "https://tamkfullstack2022-spotify.web.app/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const scopes =
    "user-read-private%20playlist-modify-public%20playlist-modify-private%20user-library-read%20user-library-modify%20playlist-read-private";
  const LOCATION = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${scopes}`;

  const login = () => {
    window.location.href = LOCATION;
    localStorage.setItem("loggedInTime", new Date().getTime().toString());
    // Get hash from url
  };
  useEffect(() => {
    const hash = window.location.hash;
    if (hash !== "") {
      const token = hash.split("=")[1].split("&")[0];
      window.localStorage.setItem("token", token);
    }
  }, []);

  useEffect(() => {
    // Define token from hash and store it in local storage, if it exists
    // If token exists, set loggedIn to true else, set loggedIn to false
    // If token does not exist, redirect to login page else, redirect to find recommendations page
    // Token is stored in local storage to prevent it from being lost when the page is refreshed
    const token = window.localStorage.getItem("token");
    if (token !== "" && token !== null) {
      setHasToken(true);
      localStorage.setItem("loggedIn", "true");
      
    } else {
      setHasToken(false);
      localStorage.setItem("loggedIn", "false");
    }
  }, []);
  useEffect(() => {
    // If user_id does not exist in local storage, get user id from api and store in local storage
    if (window.localStorage.getItem("user") == "") {
      GET_USER();
    }
  }, []);

  if (hasToken) {
    return <Navigate to="/recommendations" />;
  }

  return (
    <div>
      <div className="flex justify-center text-center text-3xl font-jost mt-10 font-bold text-white">
        SPOTIFY RECOMMENDATIONS
      </div>
      <div className="flex justify-center">
        <button
          className=" mt-5 btn btn-active bg-cyan-500 text-white hover:bg-cyan-700 border-none"
          onClick={login}
        >
          Login with Spotify
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
