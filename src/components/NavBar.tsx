import {useState, useEffect} from "react";

const NavBar = (props: any) => {
    const [loggedInState, setLoggedInState] = useState(false);
    const checkLoggedStatus = () => {
        const logged = window.localStorage.getItem("loggedIn");
        const loggedBool = logged === "True";
        setLoggedInState(loggedBool);
    };

    useEffect(() => {
        checkLoggedStatus();
    }, [loggedInState]);

    const logout = () => {
        window.localStorage.setItem("loggedIn", "False");
        window.localStorage.setItem("token", "");
        const logoutWindow = window.open("https://www.spotify.com/logout/", "_blank");
        setTimeout(() => {
            logoutWindow?.close();
            // Then, redirect back to login page
            window.location.href = "/";
        }, 1000);
    };
    const redirect = () => {
        if (loggedInState) {
            window.location.href = "/recommendations";
        } else {
            window.location.href = "/";
        }
    };
    const redirectPages = (page: string) => {
        if (page === "playlists") {
            window.location.href = "/playlists";
        } else if (page === "about") {
            window.location.href = "/about";
        } else if (page === "home") {
            window.location.href = "/recommendations";
        }
    };

    return (
      <div className="navbar bg-c-dark-2/20 border-b-2 border-white/20 ">
          <div className="flex-none ">
              <button
                onClick={redirect}
                className="border-transparent flex-4 ml-4 neutral-focus hover:text-white"
              >
                  <a className="font-virgil text-white hover:text-white border-transparent text-base ">
                      SPOTIFY RECOMMENDATIONS
                  </a>
              </button>
              <div>
                  {loggedInState ? (
                    <span>
              <button
                // Onclick redirect to about page
                onClick={() => redirectPages("home")}
                className="btn w-24 btn-square btn-ghost ml-5 hover:bg-white/5"
              >
                Home
              </button>
              <button
                // Onclick redirect to about page
                onClick={() => redirectPages("playlists")}
                className="btn w-40 btn-square btn-ghost ml-5 hover:bg-white/5"
              >
                Create Playlist
              </button>
              <span className="absolute right-0">
                <button
                  // Onclick redirect to about page
                  onClick={() => redirectPages("about")}
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
            </span>
                  ) : (
                    <button
                      // Onclick redirect to about page
                      onClick={() => redirectPages("about")}
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
