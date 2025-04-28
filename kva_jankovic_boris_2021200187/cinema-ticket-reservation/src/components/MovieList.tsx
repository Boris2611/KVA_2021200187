import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Movie } from '../types';
import MovieFilter, { MovieFilterValues } from './MovieFilter';
import { useAppContext } from '../context/AppContext';
import '../styles/components/MovieList.css';

// Pomocna funkcija za generisanje termina
const generateShowtimes = (startDate: string) => {
    const base = new Date(startDate);
    if (isNaN(base.getTime())) return [];
    return [
        base.toISOString(),
        new Date(base.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        new Date(base.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    ];
};

const getNextShowtime = (showtimes: string[]) => {
    const now = new Date();
    return showtimes
        .map(s => new Date(s))
        .filter(d => d > now)
        .sort((a, b) => +a - +b)[0] || null;
};

// Odvojena komponenta za prikaz jednog filma u listi
const MovieCard: React.FC<{
    movie: any;
    user: any;
    reservations: any[];
    onReserve: (movie: any, showtime: string) => void;
    onShowPopup: (movie: any) => void;
}> = ({ movie, user, reservations, onReserve, onShowPopup }) => {
    const now = new Date();
    const futureShowtimes = movie.showtimes
        .map((s: string) => new Date(s))
        .filter((d: Date) => d > now)
        .sort((a: Date, b: Date) => +a - +b);
    const isInactive = futureShowtimes.length === 0;
    const shortDesc = movie.description.length > 60
        ? movie.description.slice(0, 60) + '...'
        : movie.description;
    const shortActors = movie.actors && movie.actors.length > 60
        ? movie.actors.slice(0, 60) + '...'
        : movie.actors;
    const nextShowtime = getNextShowtime(movie.showtimes);
    const isReserved = user && reservations.some((r: any) => r.user.email === user.email && r.movieId === movie.id && r.status === 'rezervisano');

    return (
        <li className={`movie-card${isInactive ? ' inactive' : ''}`}>
            {isReserved && (
                <div className="reserved-label">Rezervisan</div>
            )}
            <img src={movie.image} alt={movie.title} className="movie-image" />
            <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>
                    <strong>Opis:</strong> {shortDesc}
                    {movie.description.length > 60 && (
                        <button className="read-more-btn" type="button" onClick={() => onShowPopup(movie)}>
                            Prikaži više
                        </button>
                    )}
                </p>
                <p><strong>Žanr:</strong> <span className="genre">{movie.genre}</span></p>
                {movie.director && <p><strong>Režiser:</strong> {movie.director}</p>}
                {movie.actors && (
                    <p>
                        <strong>Glumci:</strong> {shortActors}
                        {movie.actors.length > 60 && (
                            <button className="read-more-btn" type="button" onClick={() => onShowPopup(movie)}>
                                Prikaži više
                            </button>
                        )}
                    </p>
                )}
                {movie.runTime && <p>{movie.runTime} minuta</p>}
                <p><strong>Cena:</strong> {movie.price} RSD</p>
                {movie.reviews?.length > 0 && (
                    <div>
                        <strong>Recenzije:</strong>
                        <ul>
                            {movie.reviews.slice(0,2).map((rev: any, i: number) => (
                                <li key={i}><b>{rev.user}:</b> {rev.comment}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="next-showtime-row">
                    <strong>Sledeći termin:</strong>{' '}
                    {nextShowtime ? (
                        <>
                            <span className="next-showtime">
                                {nextShowtime.toLocaleString('sr-RS', { dateStyle: 'short', timeStyle: 'short' })}
                            </span>
                            <button
                                className="reserve-btn"
                                style={{ marginLeft: 8, padding: '4px 12px', fontSize: '0.95rem' }}
                                onClick={() => onReserve(movie, nextShowtime.toISOString())}
                            >
                                Rezerviši
                            </button>
                            {movie.showtimes.filter((s: string) => new Date(s) > now).length > 1 && (
                                <button
                                    className="more-showtimes-btn"
                                    type="button"
                                    onClick={() => onShowPopup(movie)}
                                    style={{ marginLeft: 8 }}
                                >
                                    Ostali termini
                                </button>
                            )}
                        </>
                    ) : (
                        <span style={{ color: '#888', marginLeft: 6 }}>Nema više termina</span>
                    )}
                </div>
                {isInactive && <div className="inactive-label">Nema više termina</div>}
            </div>
        </li>
    );
};

// Popup komponenta za detalje filma i sve termine
const MoviePopup: React.FC<{
    movie: any;
    onClose: () => void;
    onReserve: (movie: any, showtime: string) => void;
}> = ({ movie, onClose, onReserve }) => (
    <div className="popup-overlay" onClick={onClose}>
        <div className="popup-content" onClick={e => e.stopPropagation()}>
            <img src={movie.image} alt={movie.title} style={{ width: 120, borderRadius: 8, marginBottom: 10 }} />
            <h2>{movie.title}</h2>
            {movie.originalTitle && <p><em>({movie.originalTitle})</em></p>}
            <p><strong>Opis:</strong> {movie.description}</p>
            <p><strong>Žanr:</strong> {movie.genre}</p>
            {movie.director && <p><strong>Režiser:</strong> {movie.director}</p>}
            {movie.actors && <p><strong>Glumci:</strong> {movie.actors}</p>}
            {movie.runTime && <p><strong>Trajanje:</strong> {movie.runTime} min</p>}
            <p><strong>Cena:</strong> {movie.price} RSD</p>
            <p><strong>Termini:</strong></p>
            <ul className="popup-showtimes-list">
                {movie.showtimes.map((s: string) => {
                    const date = new Date(s);
                    const isPast = date < new Date();
                    return (
                        <li key={s} className={`popup-showtime${isPast ? ' past' : ''}`}>
                            {date.toLocaleString('sr-RS', { dateStyle: 'short', timeStyle: 'short' })}
                            {!isPast && (
                                <button
                                    className="reserve-btn"
                                    style={{ marginLeft: 10, padding: '4px 12px', fontSize: '0.95rem' }}
                                    onClick={() => {
                                        onClose();
                                        onReserve(movie, s);
                                    }}
                                >
                                    Rezerviši
                                </button>
                            )}
                        </li>
                    );
                })}
            </ul>
            {movie.reviews?.length > 0 && (
                <div style={{ marginTop: 14 }}>
                    <strong>Recenzije:</strong>
                    <ul>
                        {movie.reviews.map((rev: any, i: number) => (
                            <li key={i}><b>{rev.user}:</b> {rev.comment}</li>
                        ))}
                    </ul>
                </div>
            )}
            <button style={{ marginTop: 18 }} onClick={onClose}>
                Zatvori
            </button>
        </div>
    </div>
);

const MovieList: React.FC = () => {
    const [movies, setMovies] = useState<any[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [popupMovie, setPopupMovie] = useState<any | null>(null);
    const history = useHistory();
    const { user, reservations } = useAppContext();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch('https://movie.pequla.com/api/movie');
                if (!response.ok) throw new Error('Neuspešno učitavanje filmova');
                const data = await response.json();
                const apiMovies = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
                const mappedMovies = apiMovies.map((m: any) => ({
                    id: m.movieId,
                    title: m.title,
                    originalTitle: m.originalTitle,
                    description: m.description || m.shortDescription || 'Nema opisa.',
                    genre: Array.isArray(m.movieGenres) && m.movieGenres.length > 0
                        ? m.movieGenres.map((g: any) => g.genre?.name).filter(Boolean).join(', ')
                        : 'Nepoznato',
                    director: m.director?.name || '',
                    actors: Array.isArray(m.movieActors) && m.movieActors.length > 0
                        ? m.movieActors.map((a: any) => a.actor?.name).filter(Boolean).join(', ')
                        : '',
                    runTime: m.runTime,
                    image: m.poster || '/images/default.jpg',
                    showtimes: m.startDate ? generateShowtimes(m.startDate) : [],
                    price: m.price || 400,
                    reviews: m.reviews || [],
                }));
                setMovies(mappedMovies);
                setFilteredMovies(mappedMovies);
            } catch (err) {
                setError((err as Error).message);
                setMovies([]);
                setFilteredMovies([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    const genres = Array.from(
        new Set(
            movies.flatMap(m => m.genre.split(',').map((g: string) => g.trim()))
        )
    ).filter(g => g && g !== 'Nepoznato');

    const handleReserve = (movie: any, showtime: string) => {
        history.push({
            pathname: '/reservation',
            state: { movie: { ...movie, selectedShowtime: showtime } }
        });
    };

    const handleFilter = (values: MovieFilterValues) => {
        let filtered = movies;
        if (values.title) {
            filtered = filtered.filter(m =>
                m.title && m.title.toLowerCase().includes(values.title.toLowerCase())
            );
        }
        if (values.genre) {
            filtered = filtered.filter(m =>
                m.genre.split(',').map((g: string) => g.trim()).includes(values.genre)
            );
        }
        if (values.sortBy === 'title') {
            filtered = [...filtered].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        } else {
            filtered = [...filtered].sort((a, b) => {
                const aNext = getNextShowtime(a.showtimes) || new Date(8640000000000000);
                const bNext = getNextShowtime(b.showtimes) || new Date(8640000000000000);
                return +aNext - +bNext;
            });
        }
        setFilteredMovies(filtered);
    };

    if (loading) return <div>Učitavanje...</div>;
    if (error) return <div>Greška: {error}</div>;

    const now = new Date();
    const sortedMovies = [
        ...filteredMovies.filter(m => m.showtimes.some((s: string) => new Date(s) > now)),
        ...filteredMovies.filter(m => !m.showtimes.some((s: string) => new Date(s) > now))
    ];

    return (
        <div className="movie-list-container">
            <h2>Repertoar</h2>
            <MovieFilter genres={genres} onFilter={handleFilter} />
            {sortedMovies.length === 0 && (
                <div style={{textAlign: 'center', color: '#888', margin: 40}}>Nema filmova za prikaz.</div>
            )}
            <ul className="movie-list">
                {sortedMovies.map(movie => (
                    <MovieCard
                        key={movie.id}
                        movie={movie}
                        user={user}
                        reservations={reservations}
                        onReserve={handleReserve}
                        onShowPopup={setPopupMovie}
                    />
                ))}
            </ul>
            {popupMovie && (
                <MoviePopup
                    movie={popupMovie}
                    onClose={() => setPopupMovie(null)}
                    onReserve={handleReserve}
                />
            )}
        </div>
    );
};

export default MovieList;