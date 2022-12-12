const getTrackLength = (trackLength: number) => {
    const date: Date = new Date(trackLength);
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
};

const modifyDanceability = (danceability: number) => {
    // If danceability is greater than 0.2, subtract 0.2, else set to 0
    // If danceability is less than 0.8, add 0.2, else set to 1
    let minDanceability: number =
      Math.round((danceability > 0.2 ? danceability - 0.2 : 0) * 100) / 100;
    let maxDanceability: number =
      Math.round((danceability < 0.8 ? danceability + 0.2 : 1) * 100) / 100;

    // Return object with min and max danceability
    return {minDanceability, maxDanceability};
};

const getRandomGenres = (data: any) => {
    const genres = data.flat(); // Flatten array
    let randomGenres = []; // Create empty array
    for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * genres.length); // Get random index
        randomGenres.push(genres[randomIndex]); // Push random genre to array
    }
    randomGenres = [...new Set(randomGenres)]; // Remove duplicates
    return genres.length > 0 ? randomGenres.join(",") : ""; // Return genres as one string
};

const modifyTempo = (tempo: number) => {
    const minTempo = tempo > 10 ? tempo - 10 : 0;
    const maxTempo = tempo < 240 ? tempo + 10 : 250;
    return {minTempo, maxTempo};
};
export {getTrackLength, modifyDanceability, getRandomGenres, modifyTempo};
