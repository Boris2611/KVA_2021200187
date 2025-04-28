export interface Review {
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
  rating: number;
  image: string;
  showtimes: string[];
  selectedShowtime?: string;
  director: string;
  actors: string;
  duration: number;
  releaseDate: string;
  price: number;
  reviews: Review[];
}

export interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
  favoriteGenres: string[];
}

export type ReservationStatus = 'rezervisano' | 'gledano' | 'otkazano';

export interface Reservation {
  movieId: number;
  movieTitle: string;
  showtime: string;
  date: string;
  time: string;
  seats: string[];
  user: User;
  price: number;
  status: ReservationStatus;
  rating?: number;
  review?: string;
}