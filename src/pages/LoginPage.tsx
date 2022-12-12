import { useEffect, useState } from "react";

// It isn't best practice to use ":any" type but it is what it is, using it for now.
const LoginPage = (props: { location: any, loggedIn: any}) => {
  const { location, loggedIn, } = props;
  const [loggedInClicked, setLoggedInClicked] = useState(false);

  const login = () => {
    if (!loggedIn) {
      window.location.href = location;
    } else {
      window.location.href = "/recommendations";
    }
  };


  useEffect(() => {
    if (loggedInClicked) {
      login();
    }
  }, [loggedInClicked]);

  return (
    <div>
      <div className="flex justify-center text-center text-3xl font-jost mt-10 font-bold text-white">
        SPOTIFY RECOMMENDATIONS
      </div>
      <div className="flex justify-center">
        <button
          className=" mt-5 btn btn-active bg-cyan-500 text-white hover:bg-cyan-700 border-none"
          onClick={() => {
            setLoggedInClicked(true);
          }}
        >
          Login with Spotify
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
