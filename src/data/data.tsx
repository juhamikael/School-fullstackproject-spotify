export const faqData = {
  1: {
    header: "Track URL search and how does it work?",
    text: "Right click song from Spotify application or from Spotify web player and select 'Copy Spotify URL'.",
    text2: "Paste the URL into the search bar and click 'Search'.",
    text3: "",
    link: "",
  },
  2: {
    header: "How recommendations are found?",
    text: "After clicking SEARCH the program searches for similar songs to the one you provided by using SpotifyAPI. Similar songs are found primarily by the genre and tempo the song.",
    text2: "",
    text3: "",
    link: "https://developer.spotify.com/console/get-recommendations/",
  },
  3: {
    header: "Valid URL?",
    text: "If the link is valid Spotify track URL, search button will be enabled and it let's you search for recommendations. Else, it remain disabled.",
    text2: "",
    text3: "",
    link: "",
  },
  4: {
    header: "Is it safe to login with Spotify?",
    text: "Yes, it is safe to login with Spotify.  It is only used to make requests to Spotify API.",
    text2:
      "Your token is stored in your browser's local storage and it is not sent to any server.",
    text3:
      "We do store your userid in our database, but only for the purpose we can identify you and your recommendations.",
    link: "",
  },
};
