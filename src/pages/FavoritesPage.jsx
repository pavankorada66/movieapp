import React, { useEffect, useState } from "react";
import styles from "./FavoritePage.module.css";

const FavoritePage = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  const handleRemove = (imdbID) => {
    const updatedFavorites = favorites.filter((fav) => fav.imdbID !== imdbID);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  if (favorites.length === 0) {
    return <div className={styles.message}>No favorite movies added yet.</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>My Favorite Movies</h2>
      <div className={styles.cardGrid}>
        {favorites.map((movie) => (
          <div className={styles.card} key={movie.imdbID}>
            <img
              src={movie.poster !== "N/A" ? movie.poster : "/no-image.png"}
              alt={movie.title}
              className={styles.poster}
            />
           <h3 className={styles.title}>
  {(movie.title || '').length > 25 ? (movie.title || '').slice(0, 25) + "..." : movie.title || 'No Title'}
</h3>

            <p className={styles.info}><strong>Genre:</strong> {movie.genre}</p>
            <p className={styles.info}><strong>Director:</strong> {movie.director}</p>
            <button
              className={styles.removeButton}
              onClick={() => handleRemove(movie.imdbID)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritePage;
