import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchmovie, reset } from "../store/MovieSlice";
import { useNavigate } from "react-router-dom";
import "./Home.css"

function Home() {
  const [moviename, setMoviename] = useState("");
  const [page, setPage] = useState(1);
  const { movie, error, hasmore, loading } = useSelector((state) => state.movies);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const observer = useRef();

  const defaultPoster = "https://dummyimage.com/200x300/cccccc/000000&text=No+Image";

  const updatechange = (e) => {
    setMoviename(e.target.value);
  };


  useEffect(() => {
    if (moviename.length >= 3) {
      setPage(1);
      const delay = setTimeout(() => {
        dispatch(reset());
        dispatch(fetchmovie({ page: 1, moviename }));
      }, 500);
      return () => clearTimeout(delay);
    }
  }, [moviename, dispatch]);

 
  const lastMovieRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasmore) {
          const nextPage = page + 1;
          setPage(nextPage);
          dispatch(fetchmovie({ page: nextPage, moviename }));
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasmore, loading, dispatch, moviename, page]
  );

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = defaultPoster;
  };

 
  const handleFavorites = async (item) => {
    try {
      const response = await fetch(`https://www.omdbapi.com/?t=${item.Title}&apikey=915b730e`);
      const data = await response.json();
  
      if (data.Response === "True") {
        const stored = localStorage.getItem("favorites");
        const existing = stored ? JSON.parse(stored) : [];
  
        const isDuplicate = existing.some((fav) => fav.imdbID === data.imdbID);
  
        if (!isDuplicate) {
          const updated = [
            ...existing,
            {
              imdbID: data.imdbID,
              title: data.Title,
              poster: data.Poster,
              genre: data.Genre,
              director: data.Director,
            },
          ];
          localStorage.setItem("favorites", JSON.stringify(updated));
          alert("Movie added to favorites!");
        } else {
          alert("Movie already in favorites.");
        }
      } else {
        alert("Full movie details not found.");
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      alert("Something went wrong while adding to favorites.");
    }
  };
  
 

  return (
   <div className="container">
  <h2>Search for Movies</h2>
  <input
    className="searchBox"
    type="text"
    placeholder="Enter movie name..."
    value={moviename}
    onChange={updatechange}
  />

  <div className="cardGrid">
    {movie.length > 0
      ? movie.map((item, index) => (
          <div
            key={item.imdbID + index}
            className="card"
            ref={movie.length === index + 1 ? lastMovieRef : null}
          >
            <img
              src={item.Poster !== "N/A" ? item.Poster : defaultPoster}
              alt={item.Title}
              className="poster"
              onError={handleImageError}
            />
            <h3 className="title">{item.Title}</h3>
            <p className="year">{item.Year}</p>
            <button className="infoButton" onClick={() => navigate(`/moviedetail/${encodeURIComponent(item.Title)}`)}>
              More Info
            </button>
            <button className="favButton" onClick={() => handleFavorites(item)}>
              Add to Favorites
            </button>
          </div>
        ))
      : moviename.length >= 3 && !error && <p>Loading...</p>}
  </div>

  {error && <p style={{ color: "red" }}>{error}</p>}
</div>  
  );
}

export default Home;
