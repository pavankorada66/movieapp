import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './MovieDetail.module.css';

const API_KEY = '915b730e';

const MovieDetail = () => {
  const { title: rawTitle } = useParams();
  const title = decodeURIComponent(rawTitle);
console.log(title)
  const [movie, setMovie] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const defaultPoster = "https://dummyimage.com/200x300/cccccc/000000&text=No+Image";

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`https://www.omdbapi.com/?t=${title}&apikey=${API_KEY}`);
        const data = await response.json();
        if (data.Response === 'True') {
          setMovie(data);
        } else {
          console.error('Movie not found:', data.Error);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchMovie();
  }, [title]);

  useEffect(() => {
    if (movie?.imdbID) {
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      const exists = favorites.some((fav) => fav.imdbID === movie.imdbID);
      setIsFavorite(exists);
    }
  }, [movie]);

  const handleAddToFavorites = () => {
    if (!movie) return;

    try {
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      const exists = favorites.some((fav) => fav.Title === movie.Title);

      if (!exists) {
        favorites.push({
          imdbID: movie.imdbID,
          title: movie.Title,
          poster: movie.Poster,
          genre: movie.Genre,
          director: movie.Director,
        });

        localStorage.setItem('favorites', JSON.stringify(favorites));
        setIsFavorite(true);
        alert('Movie added to favorites!');
      } else {
        alert('Movie is already in favorites.');
      }
    } catch (error) {
      console.error('LocalStorage error:', error);
    }
  };

  if (!movie) {
    return <div className={styles.container}><p>Loading movie...</p></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img
          src={movie.Poster !== 'N/A' ? movie.Poster : defaultPoster}
          alt={movie.Title}
          className={styles.poster}
        />
        <h2 className={styles.title}>{movie.Title}</h2>

        <p className={styles.plot}>{movie.Plot !== 'N/A' ? movie.Plot : 'No plot available.'}</p>
        <p><strong>Genre:</strong> {movie.Genre}</p>
        <p><strong>Director:</strong> {movie.Director}</p>

        <button
          className={styles.button}
          onClick={handleAddToFavorites}
          disabled={isFavorite}
        >
          {isFavorite ? 'Added to Favorites' : 'Add to Favorites'}
        </button>
      </div>
    </div>
  );
};

export default MovieDetail;
