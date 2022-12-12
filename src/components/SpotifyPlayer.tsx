const SpotifyPlayer = (props: { width: string; trackID: string | null; height: string }) => {
    const {width, height, trackID} = props;
    const embedWidth = `${width}%`;

    const trackURL = `https://open.spotify.com/embed/track/${trackID}`;
    return (
      <iframe src={trackURL}
              className="rounded-2xl"
              width={embedWidth}
              height={height}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
      >

      </iframe>
    )

}

export default SpotifyPlayer