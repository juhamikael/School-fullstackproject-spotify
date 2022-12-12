export const faqData = {
    1: {
        header: "What is this?",
        text: "This is a web app that uses the Spotify API to generate recommendations based on song you submit on the text field.",
        text2: "This is like Spotify 'Song Radio'. ",
        text3: "Great tool for discovering new music!",
        link: "",
    },
    2: {
        header: "Track URL search and how does it work?",
        text: "Right click song from Spotify application or from Spotify web player and select 'Copy Spotify URL'.",
        text2: "Paste the URL into the search bar and click 'Search'.",
        text3: "",
        link: "",
    },
    3: {
        header: "How recommendations are found?",
        text: "After clicking SEARCH the program searches for similar songs to the one you provided by using SpotifyAPI. Similar songs are found primarily by the genre and tempo the song.",
        text2: "",
        text3: "",
        link: "https://developer.spotify.com/console/get-recommendations/",
    },
    4: {
        header: "Valid URL?",
        text: "If the link is valid Spotify track URL, search button will be enabled and it let's you search for recommendations. Else, it remain disabled.",
        text2: "",
        text3: "",
        link: "",
    },
    5: {
        header: "Is it safe to login with Spotify?",
        text: "Yes, it is safe to login with Spotify.  It is only used to make requests to Spotify API.",
        text2:
          "Your token is stored in your browser's local storage and it is not sent to any server.",
        text3:
          "We do store your userid in our database, but only for the purpose we can identify you and your recommendations.",
        link: "",
    },
    6: {
        header: "Found a bug?",
        text: "This is still in development and there are some bugs to be fixed",
        text2: "If you found a bug, please report it to us.",
        text3: "",
        link: "WIP"
    },
    7: {
        header: "Third party cookies?",
        text: "Nearly all browsers are set to block third party cookies by default.",
        text2: "How it affects this app you may ask?",
        text3: "If you allow cookies in this site, you can listen full length songs in the recommendations, else you can only listen 30 seconds preview. This is more like a feature of Spotify API.",
        link: "",
    },
    8: {
        header: "502 Bad Gateway on spotify preview widget?",
        text: "Cache issue. Try to clear your browser's cache and try again. Might also be a problem with Spotify API. ",
        text2: "--",
        text3: "Try different browser or try again later.",
        link: "",
    },
    9: {
        header: "Login / Logout",
        text: "When you login, you also login to Spotify.",
        text2: "When you logout, you also logout from Spotify. Spotify logout is done by redirecting you to Spotify logout page and shutting the blank page after one second.",
        text3: "",
        link: "",

    }
};
