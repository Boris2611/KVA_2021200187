import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Reservation } from '../types';
import '../styles/pages/Confirmation.css';

const Confirmation: React.FC = () => {
    const location = useLocation<{ reservationDetails: Reservation, fromCartAdd?: boolean }>();
    const history = useHistory();
    const { reservationDetails, fromCartAdd } = location.state || {};

    return (
        <div className="confirmation">
            <h1>{fromCartAdd ? 'Dodata rezervacija u korpu!' : 'Rezervacija uspešna!'}</h1>
            {reservationDetails ? (
                <div>
                    <h2>Detalji:</h2>
                    <p><strong>Film:</strong> {reservationDetails.movieTitle}</p>
                    <p><strong>Sedišta:</strong> {reservationDetails.seats.join(', ')}</p>
                    <p><strong>Termin:</strong> {reservationDetails.showtime && new Date(reservationDetails.showtime).toLocaleString('sr-RS')}</p>
                    <p><strong>Cena:</strong> {reservationDetails.price} RSD</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 24 }}>
                        <button
                            className="confirmation-btn"
                            onClick={() => history.push('/cart')}
                        >
                            Idi u korpu
                        </button>
                        <button
                            className="confirmation-btn"
                            style={{ background: '#ffd700', color: '#1a237e', fontWeight: 700 }}
                            onClick={() => history.push('/movies')}
                        >
                            Nazad na filmove
                        </button>
                    </div>
                </div>
            ) : (
                <p>Detalji nisu dostupni.</p>
            )}
        </div>
    );
};

export default Confirmation;