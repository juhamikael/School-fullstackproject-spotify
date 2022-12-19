import "./App.css";
import NavBar from "./components/NavBar";
import FindRecommendations from "./pages/FindRecommendations";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import CreatePlaylist from "./pages/CreatePlaylist";
import {
  BrowserRouter as Router,
  Route,
  Routes as Switch,
} from "react-router-dom";


function App() {
  return (
    // Using react-router-dom to route between pages
    // Routes are defined in the Switch component
    // NavBar is rendered on all pages
    // If user is not logged in, redirect to login page
    // If user is logged in, redirect to find recommendations page

    <Router>
      <div className="App">
        <NavBar />
        <Switch>
          <Route path="/" element={<LoginPage />} />
        </Switch>
        <Switch>
          <Route path="/recommendations" element={<FindRecommendations />} />
        </Switch>
        <Switch>
          <Route path="/about" element={<AboutPage />} />
        </Switch>
        <Switch>
          <Route path="/playlists" element={<CreatePlaylist />} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
