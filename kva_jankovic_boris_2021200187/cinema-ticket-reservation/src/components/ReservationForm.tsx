import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Movie, ReservationStatus } from '../types';
import '../styles/components/ReservationForm.css';

interface ReservationFormProps {
    movie: Movie;
    selectedSeats: string[];
}

const ReservationForm: React.FC<ReservationFormProps> = ({ movie, selectedSeats }) => {
    const { addReservation, user } = useAppContext();
    const history = useHistory();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const reservation = {
            movieId: movie.id,
            movieTitle: movie.title,
            showtime: movie.selectedShowtime || '',
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            seats: selectedSeats,
            user: {
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || '',
                address: user?.address || '',
                favoriteGenres: user?.favoriteGenres || []
            },
            price: movie.price * selectedSeats.length,
            status: 'rezervisano' as ReservationStatus
        };
        addReservation(reservation);
        history.push('/confirmation', { reservationDetails: reservation, fromCartAdd: true });
    };

    return (
        <form onSubmit={handleSubmit}>
            <button type="submit" disabled={selectedSeats.length === 0}>
                Dodaj u korpu {selectedSeats.length > 0 ? `(${selectedSeats.length} sedišta)` : ''}
            </button>
        </form>
    );
};

export default ReservationForm;