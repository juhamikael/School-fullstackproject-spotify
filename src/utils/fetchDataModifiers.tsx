const getTrackLength = (trackLength: number) => {
  const date: Date = new Date(trackLength);
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const modifyDanceability = (danceability: number) => {
  let minDanceability: number =
    Math.round((danceability > 0.2 ? danceability - 0.2 : 0) * 100) / 100;
  let maxDanceability: number =
    Math.round((danceability < 0.8 ? danceability + 0.2 : 1) * 100) / 100;
  return { minDanceability, maxDanceability };
};

const getRandomGenres = (data: any) => {
  const genres = data.flat();
  let randomGenres = [];
  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * genres.length);
    randomGenres.push(genres[randomIndex]);
  }
  randomGenres = [...new Set(randomGenres)];
  return genres.length > 0 ? randomGenres.join(",") : "";
};

const modifyTempo = (tempo: number) => {
  const minTempo = tempo > 10 ? tempo - 10 : 0;
  const maxTempo = tempo < 240 ? tempo + 10 : 250;
  return { minTempo, maxTempo };
};
export { getTrackLength, modifyDanceability, getRandomGenres, modifyTempo };
