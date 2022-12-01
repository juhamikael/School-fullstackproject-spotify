const NavBar = (props: any) => {
  const { loggedIn } = props;
  console.log("Logged in ", loggedIn);

  const logout = () => {
    window.localStorage.removeItem("token");
    window.location.href = "/";
  };

  const redirect = () => {
    if (loggedIn) {
      window.location.href = "/recommendations";
    } else {
      window.location.href = "/";
    }
  };

  const about = () => {
    window.location.href = "/about";
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
          <button
            // Onclick redirect to about page
            onClick={about}
            className="btn btn-square btn-ghost w-20 ml-5 hover:bg-white/5"
          >
            About
          </button>
          {loggedIn ? (
            <button
              className="btn btn-square btn-ghost w-20 absolute right-0 mr-5"
              onClick={logout}
            >
              Logout
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
