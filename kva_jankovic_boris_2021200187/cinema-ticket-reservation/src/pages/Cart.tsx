import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import '../styles/pages/Cart.css';

const Cart: React.FC = () => {
    const { user, reservations, deleteReservation } = useAppContext();
    const history = useHistory();
    if (!user) return <div className="cart-container"><h2>Morate biti prijavljeni.</h2></div>;
    // Prikazuj samo rezervacije sa statusom "rezervisano"
    const myReservations = reservations.filter(
        r => r.user.email === user.email && r.status === 'rezervisano'
    );
    const total = myReservations.reduce((sum, r) => sum + (r.price || 0), 0);

    return (
        <div className="cart-container">
            <h2>Moja korpa</h2>
            {myReservations.length === 0 ? (
                <div className="cart-empty">Vaša korpa je prazna.</div>
            ) : (
                <>
                    <ul className="cart-list">
                        {myReservations.map(r => (
                            <li
                                className="cart-item"
                                key={
                                    r.movieId +
                                    '-' +
                                    r.user.email +
                                    '-' +
                                    r.showtime +
                                    '-' +
                                    r.seats.join('_')
                                }
                            >
                                <div>
                                    <strong>{r.movieTitle}</strong>
                                    <span className="cart-status">{r.status}</span>
                                </div>
                                <div>Termin: {new Date(r.showtime).toLocaleString('sr-RS')}</div>
                                <div>Sedišta: {r.seats.join(', ')}</div>
                                <div>Cena: {r.price} RSD</div>
                                <button onClick={() => deleteReservation(r.movieId, r.user.email, r.showtime)}>
                                    Otkaži
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="cart-total">Ukupno: {total} RSD</div>
                    <div className="cart-actions">
                        <button
                            className="cart-checkout-btn"
                            onClick={() => history.push('/checkout')}
                        >
                            Nastavi na plaćanje
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;