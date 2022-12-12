import "./App.css";
import NavBar from "./components/NavBar";
import FindRecommendations from "./pages/FindRecommendations";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import CreatePlaylist from "./pages/CreatePlaylist";

import {useEffect, useState} from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes as Switch,
} from "react-router-dom";


function App() {
    const CLIENT_ID = "affcac7cf94f421abae557aea6dddc15";

    // Dev REDIRECT_URI
    const REDIRECT_URI = "http://127.0.0.1:5173/";
    // const REDIRECT_URI = "https://tamkfullstack2022-spotify.web.app/";
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const RESPONSE_TYPE = "token";
    const [loggedIn, setLoggedIn] = useState(false);
    const scopes = "user-read-private%20playlist-modify-public%20playlist-modify-private%20user-library-read%20user-library-modify%20playlist-read-private";
    const LOCATION = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${scopes}`;

    useEffect(() => {
        // Define token from hash and store it in local storage, if it exists
        // If token exists, set loggedIn to true else, set loggedIn to false
        // If token does not exist, redirect to login page else, redirect to find recommendations page
        // Token is stored in local storage to prevent it from being lost when the page is refreshed
        const hash = window.location.hash;
        let token = window.localStorage.getItem("token");

        if (!token && hash) {
            token = hash.split("=")[1].split("&")[0];
            window.localStorage.setItem("token", token);
            window.localStorage.setItem("loggedInTime", Date.now().toString());
        }
        if (token) {
            setLoggedIn(true);
            window.localStorage.setItem("loggedIn", "True");
        } else {
            setLoggedIn(false);
            window.localStorage.setItem("loggedIn", "False");
        }
    }, []);


    return (
      // Using react-router-dom to route between pages
      // Routes are defined in the Switch component
      // NavBar is rendered on all pages
      // If user is not logged in, redirect to login page
      // If user is logged in, redirect to find recommendations page

      <Router>
          <div className="App">
              <NavBar/>
              <Switch>
                  <Route
                    path="/"
                    element={<LoginPage location={LOCATION} loggedIn={loggedIn}/>}
                  />
              </Switch>
              <Switch>
                  <Route path="/recommendations" element={<FindRecommendations/>}/>
              </Switch>
              <Switch>
                  <Route path="/about" element={<AboutPage/>}/>
              </Switch>
              <Switch>
                  <Route path="/playlists" element={<CreatePlaylist/>}/>
              </Switch>
          </div>
      </Router>
    );
}

export default App;

