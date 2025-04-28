import React from 'react';
import '../styles/components/MovieDetails.css';

interface MovieDetailsProps {
  title: string;
  description: string;
  releaseDate: string;
  rating: number;
  genre: string;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ title, description, releaseDate, rating, genre }) => {
  return (
    <div className="movie-details">
      <h2>{title}</h2>
      <p><strong>Description:</strong> {description}</p>
      <p><strong>Release Date:</strong> {releaseDate}</p>
      <p><strong>Rating:</strong> {rating} / 10</p>
      <p><strong>Genre:</strong> {genre}</p>
    </div>
  );
};

export default MovieDetails;