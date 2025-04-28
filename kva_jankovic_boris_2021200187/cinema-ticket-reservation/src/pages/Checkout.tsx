import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import '../styles/pages/Cart.css';

const Checkout: React.FC = () => {
    const { user, reservations } = useAppContext();

    // Hookovi moraju biti na vrhu!
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!user) return <div className="cart-container"><h2>Morate biti prijavljeni.</h2></div>;
    const myReservations = reservations.filter(r => r.user.email === user.email && r.status === 'rezervisano');
    const total = myReservations.reduce((sum, r) => sum + (r.price || 0), 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!cardName || !cardNumber || !expiry || !cvc) {
            setError('Popunite sva polja.');
            return;
        }
        if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
            setError('Broj kartice mora imati 16 cifara.');
            return;
        }
        if (!/^\d{2}\/\d{2}$/.test(expiry)) {
            setError('Datum isteka mora biti u formatu MM/YY.');
            return;
        }
        if (!/^\d{3,4}$/.test(cvc)) {
            setError('CVC mora imati 3 ili 4 cifre.');
            return;
        }
        setError('');
        setSuccess(true);
        // Ovde bi išlo pravo procesiranje plaćanja i ažuriranje rezervacija
    };

    if (success) {
        return (
            <div className="cart-container">
                <h2>Plaćanje uspešno!</h2>
                <p>Vaše rezervacije su potvrđene. Hvala na kupovini!</p>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h2>Plaćanje</h2>
            {myReservations.length === 0 ? (
                <div className="cart-empty">Nemate rezervacija za plaćanje.</div>
            ) : (
                <>
                    <ul className="cart-list">
                        {myReservations.map(r => (
                            <li className="cart-item" key={
                                r.movieId +
                                '-' +
                                r.user.email +
                                '-' +
                                r.showtime +
                                '-' +
                                r.seats.join('_')
                            }>
                                <div>
                                    <strong>{r.movieTitle}</strong>
                                </div>
                                <div>Termin: {new Date(r.showtime).toLocaleString('sr-RS')}</div>
                                <div>Sedišta: {r.seats.join(', ')}</div>
                                <div>Cena: {r.price} RSD</div>
                            </li>
                        ))}
                    </ul>
                    <div className="cart-total">Ukupno za plaćanje: {total} RSD</div>
                    <form onSubmit={handleSubmit} style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <input
                            type="text"
                            placeholder="Ime i prezime na kartici"
                            value={cardName}
                            onChange={e => setCardName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Broj kartice (16 cifara)"
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value.replace(/[^\d]/g, '').slice(0,16))}
                            maxLength={16}
                            required
                        />
                        <div style={{ display: 'flex', gap: 10 }}>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                value={expiry}
                                onChange={e => setExpiry(e.target.value.replace(/[^\d/]/g, '').slice(0,5))}
                                maxLength={5}
                                required
                                style={{ flex: 1 }}
                            />
                            <input
                                type="text"
                                placeholder="CVC"
                                value={cvc}
                                onChange={e => setCvc(e.target.value.replace(/[^\d]/g, '').slice(0,4))}
                                maxLength={4}
                                required
                                style={{ flex: 1 }}
                            />
                        </div>
                        {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
                        <button className="cart-checkout-btn" type="submit">
                            Potvrdi i plati
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default Checkout;