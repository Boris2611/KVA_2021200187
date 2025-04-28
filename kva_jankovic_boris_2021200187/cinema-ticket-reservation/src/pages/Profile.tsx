import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import '../styles/pages/Profile.css';

const genresList = ['Komedija', 'Drama', 'Avantura', 'Akcija', 'Horor', 'SF', 'Animirani'];

const Profile: React.FC = () => {
    const { user, updateProfile, reservations, updateReservation } = useAppContext();
    const [edit, setEdit] = useState(false);
    // useState hookovi moraju biti na vrhu, pre bilo kakvog return-a!
    const [form, setForm] = useState(user || {
        name: '', email: '', phone: '', address: '', favoriteGenres: []
    });
    const [hiddenReservations, setHiddenReservations] = useState<string[]>([]);

    if (!user) {
        return (
            <div className="profile-container">
                <h2>Niste prijavljeni</h2>
                <p>Molimo vas da se prijavite kako biste videli svoj profil.</p>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleGenres = (e: React.ChangeEvent<HTMLInputElement>) => {
        const genre = e.target.value;
        setForm({
            ...form,
            favoriteGenres: form.favoriteGenres.includes(genre)
                ? form.favoriteGenres.filter((g: string) => g !== genre)
                : [...form.favoriteGenres, genre]
        });
    };

    const handleSave = () => {
        updateProfile(form);
        setEdit(false);
    };

    const myReservations = reservations
        .filter(r => r.user.email === user.email)
        .filter(r => !hiddenReservations.includes(
            r.movieId + '-' + r.user.email + '-' + r.showtime + '-' + r.seats.join('_')
        ));

    const handleMarkAsWatched = (r: any) => {
        updateReservation({ ...r, status: 'gledano' });
    };

    const handleReviewSaved = (r: any) => {
        setHiddenReservations(prev => [
            ...prev,
            r.movieId + '-' + r.user.email + '-' + r.showtime + '-' + r.seats.join('_')
        ]);
    };

    return (
        <div className="profile-container">
            <h2>Profil korisnika</h2>
            <div className="profile-info">
                {edit ? (
                    <>
                        <input name="name" value={form.name} onChange={handleChange} placeholder="Ime i prezime" />
                        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" disabled />
                        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Telefon" />
                        <input name="address" value={form.address} onChange={handleChange} placeholder="Adresa" />
                        <div className="genres-list">
                            {genresList.map(g => (
                                <label key={g}>
                                    <input
                                        type="checkbox"
                                        value={g}
                                        checked={form.favoriteGenres.includes(g)}
                                        onChange={handleGenres}
                                    /> {g}
                                </label>
                            ))}
                        </div>
                        <button onClick={handleSave}>Sačuvaj</button>
                    </>
                ) : (
                    <>
                        <p><strong>Ime:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Telefon:</strong> {user.phone}</p>
                        <p><strong>Adresa:</strong> {user.address}</p>
                        <p><strong>Omiljeni žanrovi:</strong> {user.favoriteGenres?.join(', ')}</p>
                        <button className="edit-btn" onClick={() => setEdit(true)}>Izmeni profil</button>
                    </>
                )}
            </div>
            <div className="profile-reservations">
                <h3>Moje rezervacije</h3>
                <ul className="reservation-list">
                    {myReservations.map(r => (
                        <li
                            key={
                                r.movieId +
                                '-' +
                                r.user.email +
                                '-' +
                                r.showtime +
                                '-' +
                                r.seats.join('_')
                            }
                            className="reservation-item"
                        >
                            <div>
                                <strong>{r.movieTitle}</strong>
                                <span className="reservation-status">{r.status}</span>
                                <br />
                                Termin: {new Date(r.showtime).toLocaleString('sr-RS')}
                                <br />Sedišta: {r.seats.join(', ')} | Cena: {r.price} RSD
                            </div>
                            {r.status === 'rezervisano' && (
                                <button onClick={() => handleMarkAsWatched(r)}>
                                    Označi kao gledano
                                </button>
                            )}
                            {r.status === 'gledano' && (
                                <ReviewForm reservation={r} onSaved={() => handleReviewSaved(r)} />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const ReviewForm: React.FC<{ reservation: any; onSaved: () => void }> = ({ reservation, onSaved }) => {
    const { updateReservation } = useAppContext();
    const [rating, setRating] = useState(reservation.rating || 0);
    const [review, setReview] = useState(reservation.review || '');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        updateReservation({ ...reservation, rating, review });
        setSaved(true);
        setTimeout(() => {
            onSaved();
        }, 1200);
    };

    return (
        <div className="review-form">
            <div>
                <span>Ocena: </span>
                {[1,2,3,4,5].map(star => (
                    <span key={star} style={{ color: star <= rating ? '#ffd700' : '#bbb', cursor: 'pointer', fontSize: 22 }}
                        onClick={() => setRating(star)}
                    >★</span>
                ))}
            </div>
            <textarea
                value={review}
                onChange={e => setReview(e.target.value)}
                placeholder="Vaša recenzija"
                rows={2}
                disabled={saved}
            />
            <button onClick={handleSave} disabled={saved}>
                {saved ? 'Recenzija sačuvana!' : 'Sačuvaj recenziju'}
            </button>
        </div>
    );
};

export default Profile;