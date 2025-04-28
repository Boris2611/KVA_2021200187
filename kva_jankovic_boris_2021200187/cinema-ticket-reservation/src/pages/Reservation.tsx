import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import SeatSelection from '../components/SeatSelection';
import ReservationForm from '../components/ReservationForm';
import { Movie } from '../types';
import { useAppContext } from '../context/AppContext';
import '../styles/pages/Reservation.css';

const Reservation: React.FC = () => {
    const location = useLocation<{ movie?: Movie }>();
    const movie = location.state?.movie;
    const selectedShowtime = movie?.selectedShowtime;
    const { user } = useAppContext();
    const history = useHistory();
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    useEffect(() => {
        if (!user) {
            history.replace('/login');
        }
    }, [user, history]);

    if (!user) return null;
    if (!movie) return <div className="reservation-page-container"><h2>Nije izabran film za rezervaciju.</h2></div>;

    return (
        <div className="reservation-page-container">
            <h1>Rezervacija karata</h1>
            <div className="reservation-movie-info">
                <img src={movie.image} alt={movie.title} className="reservation-movie-image" />
                <div className="reservation-movie-details">
                    <h2>{movie.title}</h2>
                    <p><strong>Žanr:</strong> {movie.genre}</p>
                    <p><strong>Opis:</strong> {movie.description}</p>
                    <p><strong>Termin:</strong> {selectedShowtime && new Date(selectedShowtime).toLocaleString('sr-RS', { dateStyle: 'short', timeStyle: 'short' })}</p>
                </div>
            </div>
            <SeatSelection selectedSeats={selectedSeats} setSelectedSeats={setSelectedSeats} />
            <ReservationForm movie={movie} selectedSeats={selectedSeats} />
        </div>
    );
};

export default Reservation;