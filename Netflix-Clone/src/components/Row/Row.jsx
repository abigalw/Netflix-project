import React, { useState, useEffect } from "react";
import axios from "../../utils/axios"
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";


function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    const base_url = "https://image.tmdb.org/t/p/original";

    
    useEffect(() => {
        async function fetchData() {
          
          const req = await axios.get(fetchUrl);
          
          setMovies(req.data.results);
          return req;
        }
        
        fetchData();
      }, [fetchUrl]);
    
      
      
  
  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.title || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => console.log(error));
    }
  };


  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row__posters">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <img
              key={movie.id}
              onClick={() => handleClick(movie)}
              className={`row__poster ${isLargeRow ? "row__posterLarge" : ""}`}
              src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
              alt={movie.name || movie.title}
            />
          ))
        ) : (
          <p>Loading movies...</p>  
        )}
      </div>
  
      
      {trailerUrl && (
        <div style={{ padding: "40px" }}>
          <YouTube videoId={trailerUrl} opts={opts} />
        </div>
      )}
    </div>
  );

}

export default Row;