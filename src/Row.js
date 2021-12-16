import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
import "./Row.css";
import React, { useState, useEffect } from "react";
import axios from "./axios";
const base_url = "https://image.tmdb.org/t/p/original";

const Row = ({ title, fetchURL, isLargeRow }) => {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  // A snippet of code which runs based on a condition ([])
  useEffect(() => {
    // If [], run once when row loads and don't run again
    async function fetchData() {
      const request = await axios.get(fetchURL);
      setMovies(request.data.results);
      return request.data.results;
    }
    fetchData();
  }, [fetchURL]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.name || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => console.log(error));
    }
  };

  let moviesToRender;
  if (movies) {
    moviesToRender = movies.map((movie) => (
      <img
        key={movie.id}
        onClick={() => handleClick(movie)}
        className={`row__poster ${isLargeRow && "row__posterLarge"}`}
        src={`${base_url}${
          isLargeRow ? movie.poster_path : movie.backdrop_path
        }`}
        alt={movie.name}
      />
    ));
  }
  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row__posters">{moviesToRender}</div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
};

export default Row;
