import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {storeUserDataInDatabase} from "../utils/firebaseCRUD";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    window.localStorage.getItem("loggedIn") === "true"
  );
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedStatus = () => {
      setIsLoggedIn(window.localStorage.getItem("loggedIn") === "true");
    };
    checkLoggedStatus();
    checkHowLongLoggedIn();
  }, []);

const logout = () => {
    storeUserDataInDatabase();
    const logoutWindow = window.open(
      "https://www.spotify.com/logout/",
      "_blank"
    );
    setTimeout(() => {
      logoutWindow?.close();
      // Then, redirect back to login page
      setIsLoggedIn(false);
      navigate("/");
    }, 1000);
    // empty whole local storage
    window.localStorage.clear();
    window.localStorage.setItem("loggedIn", "false");
    window.localStorage.setItem("token", "");
    window.localStorage.setItem("user", "");
    window.localStorage.setItem("userDataLoaded", "false");
  };

  const checkHowLongLoggedIn = () => {
    const loggedInTime = window.localStorage.getItem("loggedInTime");
    const currentTime = new Date().getTime();
    if (loggedInTime) {
      const timeDifference = currentTime - parseInt(loggedInTime);
      if (timeDifference > 3600000) {
        // Log user out
        setIsLoggedIn(false);
        storeUserDataInDatabase();
        logout();
        navigate("/");
      }
    }
  };

  return (
    <div className="navbar bg-c-dark-2/20 border-b-2 border-white/20 ">
      <div className="flex-none ">
        <button
          onClick={() => navigate("/")}
          className="border-transparent flex-4 ml-4 neutral-focus hover:text-white"
        >
          <a className="font-virgil text-white hover:text-white border-transparent text-base ">
            SPOTIFY RECOMMENDATIONS
          </a>
        </button>
        <div>
          {isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/")}
                className="btn w-24 btn-square btn-ghost ml-5 hover:bg-white/5"
              >
                Home
              </button>
              <button
                onClick={() => navigate("/playlists")}
                className="btn w-40 btn-square btn-ghost ml-5 hover:bg-white/5"
              >
                Create Playlist
              </button>
              <span className="absolute right-0">
                <button
                  onClick={() => navigate("/about")}
                  className="btn btn-square btn-ghost w-20 ml-5 hover:bg-white/5 mr-10"
                >
                  About
                </button>
                <button
                  className="btn btn-square btn-ghost w-20 mr-5 "
                  onClick={logout}
                >
                  Logout
                </button>
              </span>
            </>
          ) : (
            <button
              onClick={() => navigate("/about")}
              className="btn btn-square btn-ghost w-20 ml-5 hover:bg-white/5"
            >
              About
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
