import "./App.css";
import FindRecommendations from "./pages/FindRecommendations";
import NavBar from "./components/NavBar";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes as Switch,
} from "react-router-dom";

function App() {
  const CLIENT_ID = "affcac7cf94f421abae557aea6dddc15";
  const REDIRECT_URI = "http://127.0.0.1:5173/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const [token, setToken] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const LOCATION = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`;
  const TOKENHREF = `/${token}`;
  

  useEffect(() => {
    
    // Define token from hash and store it in local storage, if it exists
    // If token exists, set loggedIn to true else, set loggedIn to false
    // If token does not exist, redirect to login page else, redirect to find recommendations page
    // Token is stored in local storage to prevent it from being lost when the page is refreshed


    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");
    console.log("token: ", token);
    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((element) => element.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
      setToken(token);
    }
    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
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
        <NavBar loggedIn={loggedIn} />
        <Switch>
          <Route path="/" element={<LoginPage location={LOCATION} loggedIn={loggedIn}  />} />
        </Switch>
        <Switch>
          <Route
            path="/recommendations"
            element={<FindRecommendations />}/>
        </Switch>
        <Switch>
          <Route path="/about" element={<AboutPage />} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
